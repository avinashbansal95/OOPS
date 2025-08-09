class IssueManagementSystem {
    private issueType : string[] = [];
    private issueListMap : Map<string,CustomerIssue> = new Map();
    private agentMap : Map<string,Agent> = new Map();
    private cs = new ChooseStategy();
    constructor(issues:string[]) {
        this.issueType = issues;
    };

    createIssue(issueId:string, orderId:string, issueType:number, description:string):string {
        //check if issue already exist
        if(this.issueListMap.get(issueId)) {
            return 'Issue already exists'
        }
        //in case issueType is not found in issueTypes list
        if(issueType < 0 || issueType > this.issueType.length - 1) {
            return 'invalid issue type'
        }
        //create a new issue
        this.issueListMap.set(issueId,new CustomerIssue(issueId,orderId,issueType,description));
        return 'issue created';
    }

    addAgent(agentId : string, expertise : number[]):string {
        if(this.agentMap.has(agentId)) {
            return 'agent already exists';
        }
        this.agentMap.set(agentId,new Agent(agentId,expertise));
        return 'success';
    };

    assignIssue(issueId:string,assignStrategy:number):string {
        let getStrategy = sMap.get(assignStrategy)
        this.cs.setStrategy(getStrategy);
        let issue = this.issueListMap.get(issueId);
        if(issue == undefined)
            return 'this issue not exist';
        if(issue.status == 'open')
            return "issue already assigned"

        let agentId = this.cs.assignIssue(this.agentMap,issue);
        if(agentId == '-1') return "agent with expertise doesn't exist"
        if(agentId) {
            issue.status = "open";
            let agent = this.agentMap.get(agentId);
            agent?._issues.push(issue);
        };
        return agentId;
    }

    resolveIssue(issueId:string,resolution:string) {
        let issue = this.issueListMap.get(issueId);
        if(issue) {
            issue.status = 'resolved';
            issue.resolution = resolution;
        }
        return;
    }

    getAgentHistory(agentId:string):string[] {
        //get the agent
        let agent = this.agentMap.get(agentId);
        let issues = agent?._issues || [];
        let list = issues?.filter((e)=>e.status == 'resolved').map((e)=>e.issueId);
        return list;
    }

}

class CustomerIssue {
    constructor(public issueId:string, public orderId:string, public issueType:number, public description:string, public status:string = '',public resolution : string = ''){}
}

class Agent {
    private issues : CustomerIssue [] = [];
    constructor(public agentId : string, public expertise : number[]) {};
    get _issues() : CustomerIssue [] {
        return this.issues;
    }
}


interface AssignStrategy {
    assignIssue(agentsList:Map<string,Agent>,issue:CustomerIssue):string;
}

class StrategyZero implements AssignStrategy {
    assignIssue(agentsList:Map<string,Agent>,issue:CustomerIssue):string {
        //Assign an agent which has lowest number of total issues open
        //step1 :  filter the agents which have experience in that issue
        let max = 0;
        let agentId = ''
        for(let [id,values] of agentsList.entries()) {
            if(values.expertise.indexOf(issue.issueType) == -1)
                continue;
            let issues = values._issues;
            let openIssuesCount = issues.filter((e)=> e.status == 'open');
            if(openIssuesCount.length > max) {
                max = openIssuesCount.length;
                agentId = values.agentId;
            }
        }
        return agentId;
    }
}

class ChooseStategy {
    private strategy !: AssignStrategy;

    public setStrategy(strategy:AssignStrategy) {
        this.strategy = strategy;
    }

     assignIssue(agentsList:Map<string,Agent>,issue:CustomerIssue):string {
        return this.strategy.assignIssue(agentsList,issue);
     }
}


let sMap = new Map();
sMap.set(0,'StrategyZero');

