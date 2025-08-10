import { Mutex, MutexInterface } from 'async-mutex';

// Helper interface (as per problem)
interface Helper03 {
    log(message: string): void;
}

// ============ Classes ============

class CustomerIssue {
    public status: 'unassigned' | 'open' | 'resolved' = 'unassigned';
    public resolution: string = '';

    constructor(
        public issueId: string,
        public orderId: string,
        public issueType: number,
        public description: string
    ) {}
}

class Agent {
    // Tracks open and resolved counts per issue type
    private openCount: Map<number, number> = new Map();
    private resolvedCount: Map<number, number> = new Map();
    private assignedIssues: CustomerIssue[] = [];

    constructor(public agentId: string, public expertise: number[]) {
        for (const type of expertise) {
            this.openCount.set(type, 0);
            this.resolvedCount.set(type, 0);
        }
    }

    // Add issue to agent
    assignIssue(issue: CustomerIssue): void {
        this.assignedIssues.push(issue);
        const type = issue.issueType;
        this.openCount.set(type, (this.openCount.get(type) || 0) + 1);
    }

    // Resolve an issue
    resolveIssue(issue: CustomerIssue): void {
        const type = issue.issueType;
        const open = this.openCount.get(type) || 0;
        if (open > 0) {
            this.openCount.set(type, open - 1);
        }
        this.resolvedCount.set(type, (this.resolvedCount.get(type) || 0) + 1);
    }

    // Get number of open issues of given type
    getOpenCountForType(type: number): number {
        return this.openCount.get(type) || 0;
    }

    // Get number of resolved issues of given type
    getResolvedCountForType(type: number): number {
        return this.resolvedCount.get(type) || 0;
    }

    // Get resolved issue IDs (most recent first)
    getResolvedIssueIds(): string[] {
        return this.assignedIssues
            .filter(issue => issue.status === 'resolved')
            .map(issue => issue.issueId)
            .reverse(); // Most recent resolved first
    }

    // Check if agent can handle this issue type
    hasExpertise(issueType: number): boolean {
        return this.expertise.includes(issueType);
    }
}

// ============ Strategy Pattern ============

interface AssignStrategy {
    assignIssue(agents: Map<string, Agent>, issue: CustomerIssue): string;
}

class StrategyZero implements AssignStrategy {
    assignIssue(agents: Map<string, Agent>, issue: CustomerIssue): string {
        let minOpenIssues = Infinity;
        let selectedAgentId = '';

        for (const [agentId, agent] of agents) {
            if (!agent.hasExpertise(issue.issueType)) continue;

            const totalOpen = agent['assignedIssues'].filter(i => i.status === 'open').length;
            if (totalOpen < minOpenIssues) {
                minOpenIssues = totalOpen;
                selectedAgentId = agentId;
            }
        }

        return selectedAgentId || '-1';
    }
}

class StrategyOne implements AssignStrategy {
    assignIssue(agents: Map<string, Agent>, issue: CustomerIssue): string {
        let maxResolved = -1;
        let selectedAgentId = '';

        for (const [agentId, agent] of agents) {
            if (!agent.hasExpertise(issue.issueType)) continue;

            const resolvedCount = agent.getResolvedCountForType(issue.issueType);
            if (resolvedCount > maxResolved) {
                maxResolved = resolvedCount;
                selectedAgentId = agentId;
            }
        }

        return selectedAgentId || '-1';
    }
}

class StrategyTwo implements AssignStrategy {
    assignIssue(agents: Map<string, Agent>, issue: CustomerIssue): string {
        let minOpenOfType = Infinity;
        let selectedAgentId = '';

        for (const [agentId, agent] of agents) {
            if (!agent.hasExpertise(issue.issueType)) continue;

            const openCount = agent.getOpenCountForType(issue.issueType);
            if (openCount < minOpenOfType) {
                minOpenOfType = openCount;
                selectedAgentId = agentId;
            }
        }

        return selectedAgentId || '-1';
    }
}

// ============ Main System ============

class IssueManagementSystem {
    private issueTypes: string[] = [];
    private issues: Map<string, CustomerIssue> = new Map();
    private agents: Map<string, Agent> = new Map();
    private strategies: Map<number, AssignStrategy> = new Map();
    private helper!: Helper03;
    private mutex: MutexInterface = new Mutex();

    // Initialize system
    async init(issueTypes: string[], helper: Helper03): Promise<void> {
        const release = await this.mutex.acquire();
        try {
            this.issueTypes = issueTypes.map(t => t.toLowerCase());
            this.issues.clear();
            this.agents.clear();
            this.helper = helper;

            // Initialize strategies
            this.strategies.clear();
            this.strategies.set(0, new StrategyZero());
            this.strategies.set(1, new StrategyOne());
            this.strategies.set(2, new StrategyTwo());
        } finally {
            release();
        }
    }

    // Create a new issue
    async createIssue(issueId: string, orderId: string, issueType: number, description: string): Promise<string> {
        const release = await this.mutex.acquire();
        try {
            if (this.issues.has(issueId)) {
                return 'issue already exists';
            }

            if (issueType < 0 || issueType >= this.issueTypes.length) {
                return 'invalid issue type';
            }

            const issue = new CustomerIssue(issueId, orderId, issueType, description);
            this.issues.set(issueId, issue);
            return 'issue created';
        } finally {
            release();
        }
    }

    // Add a new agent
    async addAgent(agentId: string, expertise: number[]): Promise<string> {
        const release = await this.mutex.acquire();
        try {
            if (this.agents.has(agentId)) {
                return 'agent already exists';
            }

            // Validate expertise indices
            for (const type of expertise) {
                if (type < 0 || type >= this.issueTypes.length) {
                    // According to problem, expertise is guaranteed valid, but safe to check
                    return 'invalid expertise'; // optional, problem says it's valid
                }
            }

            const agent = new Agent(agentId, expertise);
            this.agents.set(agentId, agent);
            return 'success';
        } finally {
            release();
        }
    }

    // Assign issue to agent based on strategy
    async assignIssue(issueId: string, assignStrategy: number): Promise<string> {
        const release = await this.mutex.acquire();
        try {
            const issue = this.issues.get(issueId);
            if (!issue) {
                return 'issue doesn\'t exist';
            }

            if (issue.status !== 'unassigned') {
                return 'issue already assigned';
            }

            const strategy = this.strategies.get(assignStrategy);
            if (!strategy) {
                return 'invalid strategy'; // though problem says it's valid
            }

            const agentId = strategy.assignIssue(this.agents, issue);
            if (agentId === '-1') {
                return 'agent with expertise doesn\'t exist';
            }

            const agent = this.agents.get(agentId)!;
            agent.assignIssue(issue);
            issue.status = 'open';

            this.helper.log(`Issue ${issueId} is assigned to agent ${agentId}`);
            return agentId;
        } finally {
            release();
        }
    }

    // Resolve an issue
    async resolveIssue(issueId: string, resolution: string): Promise<void> {
        const release = await this.mutex.acquire();
        try {
            const issue = this.issues.get(issueId);
            if (!issue || issue.status !== 'open') return;

            issue.status = 'resolved';
            issue.resolution = resolution;

            const agent = [...this.agents.values()].find(a =>
                a['assignedIssues'].some(i => i.issueId === issueId)
            );
            if (agent) {
                agent.resolveIssue(issue);
                this.helper.log(`Issue Details issueId : ${issueId}, issue type index : ${issue.issueType}, issue status : resolved by agent ${agent.agentId}, issue type : ${this.issueTypes[issue.issueType]}`);
            }
        } finally {
            release();
        }
    }

    // Get agent's resolved issue history (most recent first)
    async getAgentHistory(agentId: string): Promise<string[]> {
        const release = await this.mutex.acquire();
        try {
            const agent = this.agents.get(agentId);
            if (!agent) return [];
            return agent.getResolvedIssueIds();
        } finally {
            release();
        }
    }
}