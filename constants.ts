

import { Section } from './types';

export const PROMPT_SECTIONS: Section[] = [
  {
    id: 'waterfall-planning',
    title: 'Waterfall: Planning',
    category: 'Waterfall',
    description: 'WBS, timelines, budgeting, scope, and initial planning.',
    items: [
      {
        id: 'wf-1',
        title: 'Full WBS Generation',
        text: 'Generate a full Work Breakdown Structure (WBS) for a large enterprise system implementation with phases: Initiation → Planning → Execution → Monitoring → Closure. detailed hierarchy.',
        tags: ['Planning', 'WBS']
      },
      {
        id: 'wf-2',
        title: 'Scope Statement',
        text: 'Create a project scope statement including specific goals, key deliverables, items in-scope, items out-of-scope, constraints, and assumptions.',
        tags: ['Scope', 'Documentation']
      },
      {
        id: 'wf-3',
        title: 'Detailed Schedule',
        text: 'Draft a detailed project schedule with major milestones, task dependencies, and assigned owners for a 6-month software development project.',
        tags: ['Schedule', 'Timeline']
      },
      {
        id: 'wf-4',
        title: 'Critical Path Analysis',
        text: 'Perform a Critical Path analysis for a construction project, including definitions of float, slack, and identification of high-risk areas.',
        tags: ['Analysis', 'Risk']
      },
      {
        id: 'wf-5',
        title: 'Cost Baseline',
        text: 'Prepare a cost baseline with phase-wise budget distribution for a $500k IT infrastructure upgrade.',
        tags: ['Budget', 'Finance']
      },
      {
        id: 'wf-6',
        title: 'RACI Matrix',
        text: 'Generate a RACI matrix for a multi-vendor technology program involving Client, Vendor A (Dev), Vendor B (QA), and Hosting Provider.',
        tags: ['Governance', 'RACI']
      }
    ]
  },
  {
    id: 'waterfall-tracking',
    title: 'Waterfall: Tracking & Monitoring',
    category: 'Waterfall',
    description: 'Progress tracking, EVM, and health dashboards.',
    items: [
      {
        id: 'wf-track-1',
        title: 'Weekly Progress & EVM',
        text: 'Create a weekly progress tracking report template including Earned Value Analysis metrics: Cost Performance Index (CPI), Schedule Performance Index (SPI), and Estimate at Completion (EAC).',
        tags: ['Reporting', 'EVM']
      },
      {
        id: 'wf-track-2',
        title: 'Slippage Analysis',
        text: 'Summarize key slippage drivers and root causes for schedule variance in a delayed software release.',
        tags: ['Analysis', 'Risk']
      },
      {
        id: 'wf-track-3',
        title: 'Milestone Health Dashboard',
        text: 'Produce a milestone health dashboard concept using RAG (Red-Amber-Green) status indicators for executive review.',
        tags: ['Dashboard', 'Reporting']
      }
    ]
  },
  {
    id: 'agile-scrum',
    title: 'Agile: Scrum Ceremonies',
    category: 'Agile',
    description: 'Sprint planning, daily standups, and retrospectives.',
    items: [
      {
        id: 'scrum-1',
        title: 'Sprint Backlog Creation',
        text: 'Create a sprint backlog based on team capacity of 40 points, average velocity of 35 points, and 5 points of carryover work.',
        tags: ['Planning', 'Backlog']
      },
      {
        id: 'scrum-2',
        title: 'INVEST User Stories',
        text: 'Draft 3 user stories for a "Login Feature" with acceptance criteria using the INVEST model (Independent, Negotiable, Valuable, Estimable, Small, Testable).',
        tags: ['User Stories', 'Requirements']
      },
      {
        id: 'scrum-3',
        title: 'Sprint Goals',
        text: 'Generate concise Sprint Goals aligned with a product roadmap focused on "Improving Mobile User Retention".',
        tags: ['Goals', 'Strategy']
      },
      {
        id: 'scrum-4',
        title: 'Stand-up Note Summarizer',
        text: 'Transform these raw notes into a structured "Yesterday / Today / Blockers" Daily Scrum format: [Insert Raw Notes Here]',
        tags: ['Daily Scrum', 'Formatting']
      },
      {
        id: 'scrum-5',
        title: 'Retrospective Insights',
        text: 'Generate retrospective insights and SMART action items based on the following team feedback: "Too many meetings", "Requirements unclear", "Good team spirit".',
        tags: ['Retro', 'Improvement']
      }
    ]
  },
  {
    id: 'safe-framework',
    title: 'SAFe: Enterprise Agility',
    category: 'SAFe',
    description: 'PI Planning, ART Sync, and Inspect & Adapt.',
    items: [
      {
        id: 'safe-1',
        title: 'PI Objectives',
        text: 'Generate PI Objectives (distinguishing between committed and uncommitted) for 5 Agile teams working on an E-commerce Platform.',
        tags: ['PI Planning', 'Objectives']
      },
      {
        id: 'safe-2',
        title: 'Dependency Board',
        text: 'Create a text-based cross-team dependency board layout for Program Increment 4, showing timelines and potential risks.',
        tags: ['Planning', 'Dependencies']
      },
      {
        id: 'safe-3',
        title: 'Inspect & Adapt Workshop',
        text: 'Prepare material for an Inspect & Adapt workshop: Pareto chart data structure, Root Cause Analysis (RCA) template, and countermeasures list.',
        tags: ['I&A', 'Workshop']
      },
      {
        id: 'safe-4',
        title: 'ART Flow Metrics',
        text: 'Generate a narrative for an ART-level flow metrics dashboard explaining Flow Velocity, Flow Efficiency, and Flow Load.',
        tags: ['Metrics', 'Reporting']
      }
    ]
  },
  {
    id: 'roles-pm',
    title: 'Role: Project Manager',
    category: 'Roles',
    description: 'Prompts tailored for traditional Project Managers.',
    items: [
      {
        id: 'pm-1',
        title: 'RAID Log',
        text: 'Create a comprehensive RAID log (Risks, Assumptions, Issues, Dependencies) structure with probability, impact, owner, triggers, and mitigation plans.',
        tags: ['Risk', 'Documentation']
      },
      {
        id: 'pm-2',
        title: 'Recovery Plan',
        text: 'Prepare an executive summary for a "Red" project recovery plan, highlighting immediate actions, resource needs, and revised timeline.',
        tags: ['Crisis Mgmt', 'Executive']
      },
      {
        id: 'pm-3',
        title: 'Vendor Evaluation',
        text: 'Draft a vendor management evaluation matrix comparing 3 vendors on Cost, Technical Capability, and Cultural Fit.',
        tags: ['Procurement', 'Analysis']
      }
    ]
  },
  {
    id: 'roles-qa',
    title: 'Role: QA & Developers',
    category: 'Roles',
    description: 'Technical prompts for quality assurance and development.',
    items: [
      {
        id: 'qa-1',
        title: 'Test Strategy',
        text: 'Draft a high-level test strategy covering functional testing, non-functional testing (performance, security), and automation approach.',
        tags: ['QA', 'Strategy']
      },
      {
        id: 'dev-1',
        title: 'API Documentation',
        text: 'Generate an OpenAPI (Swagger) specification skeleton for a User Management API with endpoints: GET /users, POST /users, DELETE /users/{id}.',
        tags: ['Dev', 'API']
      },
      {
        id: 'dev-2',
        title: 'Git Strategy',
        text: 'Create a Git branching strategy document explaining Feature Branch Workflow vs Gitflow for a team of 10 developers.',
        tags: ['DevOps', 'Process']
      }
    ]
  },
  {
    id: 'jira-auto',
    title: 'Jira Automation Toolkit',
    category: 'Jira',
    description: 'JQL queries, dashboards, and Python scripts.',
    items: [
      {
        id: 'jql-1',
        title: 'Find Blocked Issues',
        text: 'Generate a JQL query to fetch all issues that were moved to "BLOCKED" status within the last 48 hours.',
        tags: ['JQL', 'Query']
      },
      {
        id: 'jql-2',
        title: 'Scope Creep Finder',
        text: 'Find all issues added to the active sprint after the sprint start date using JQL.',
        tags: ['JQL', 'Scope']
      },
      {
        id: 'jql-3',
        title: 'Assignee Search',
        text: 'Generate a JQL query to list all incomplete issues assigned to the "currentUser()" or a specific team member, ordered by priority.',
        tags: ['JQL', 'Assignee']
      },
      {
        id: 'jql-4',
        title: 'Label Filtering',
        text: 'Write a JQL query to find all tickets tagged with labels "Production" AND "Critical", excluding issues in "Done" status.',
        tags: ['JQL', 'Labels']
      },
      {
        id: 'jira-dash-1',
        title: 'Release Metrics Dashboard',
        text: 'Generate a text-based layout for a Jira dashboard focused on release metrics. Include gadgets for: Release Burndown Chart, Cycle Time trends, Release Scope (Story Points added vs completed), and Days Remaining in Release.',
        tags: ['Dashboard', 'Metrics', 'Release']
      },
      {
        id: 'jira-py-1',
        title: 'Python API Script',
        text: 'Explain the following Python code for Jira API interaction.',
        codeSnippet: {
          language: 'python',
          code: `import requests
from requests.auth import HTTPBasicAuth

url = "https://your-domain.atlassian.net/rest/api/3/search"
auth = HTTPBasicAuth("email@example.com", "api_token")

query = {
   'jql': 'status changed to Blocked AFTER -2d'
}

response = requests.get(url, headers={"Accept": "application/json"}, params=query, auth=auth)
print(response.json())`
        },
        tags: ['Python', 'Automation']
      }
    ]
  },
  {
    id: 'jira-python',
    title: 'Jira: Python API Examples',
    category: 'Jira',
    description: 'Ready-to-use Python scripts for Authentication, Search, and Updates.',
    items: [
      {
        id: 'py-auth',
        title: 'Authentication Setup',
        text: 'Python script to securely authenticate with Jira Cloud using an API Token and email address. Use this base for all other scripts.',
        tags: ['Python', 'Auth', 'Setup'],
        codeSnippet: {
          language: 'python',
          code: `import requests
from requests.auth import HTTPBasicAuth

# Configuration
JIRA_DOMAIN = "your-domain.atlassian.net"
EMAIL = "user@example.com"
API_TOKEN = "your_api_token" # Create at https://id.atlassian.com/manage-profile/security/api-tokens

url = f"https://{JIRA_DOMAIN}/rest/api/3/myself"
auth = HTTPBasicAuth(EMAIL, API_TOKEN)

try:
    response = requests.get(url, headers={"Accept": "application/json"}, auth=auth)
    if response.status_code == 200:
        print(f"Authenticated as: {response.json()['displayName']}")
    else:
        print(f"Auth Failed: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")`
        }
      },
      {
        id: 'py-search',
        title: 'Searching Issues (JQL)',
        text: 'Search for issues using JQL (e.g., High priority bugs) and parse specific fields like Summary and Status from the response.',
        tags: ['Python', 'Search', 'JQL'],
        codeSnippet: {
          language: 'python',
          code: `import requests
from requests.auth import HTTPBasicAuth

url = "https://your-domain.atlassian.net/rest/api/3/search"
auth = HTTPBasicAuth("email@example.com", "your_api_token")

# JQL: Open Bugs in 'WEB' project ordered by priority
params = {
   'jql': 'project = WEB AND issuetype = Bug AND status != Done ORDER BY priority DESC',
   'maxResults': 10,
   'fields': 'summary,status,priority'
}

response = requests.get(url, headers={"Accept": "application/json"}, params=params, auth=auth)

for issue in response.json().get('issues', []):
    print(f"[{issue['key']}] {issue['fields']['summary']} ({issue['fields']['status']['name']})")`
        }
      },
      {
        id: 'py-update',
        title: 'Updating Issues',
        text: 'Update an issue\'s description and priority via the REST API using a PUT request.',
        tags: ['Python', 'Update', 'REST'],
        codeSnippet: {
          language: 'python',
          code: `import requests
from requests.auth import HTTPBasicAuth
import json

issue_key = "WEB-123"
url = f"https://your-domain.atlassian.net/rest/api/3/issue/{issue_key}"
auth = HTTPBasicAuth("email@example.com", "your_api_token")

# Update Payload (Atlassian Document Format for description)
payload = {
    "fields": {
        "priority": {"name": "High"},
        "description": {
            "type": "doc",
            "version": 1,
            "content": [{
                "type": "paragraph",
                "content": [{"type": "text", "text": "Updated via Python Script."}]
            }]
        }
    }
}

headers = {"Accept": "application/json", "Content-Type": "application/json"}
response = requests.put(url, headers=headers, data=json.dumps(payload), auth=auth)

if response.status_code == 204:
    print("Issue updated successfully!")
else:
    print(f"Error: {response.status_code} - {response.text}")`
        }
      }
    ]
  },
  {
    id: 'inspiration-leadership',
    title: 'Motivation & Leadership',
    category: 'Inspiration',
    description: 'Prompts to boost morale, resilience, and visionary thinking.',
    items: [
      {
        id: 'inspire-1',
        title: 'Team Morale Booster',
        text: 'Draft a short, energizing speech to boost team morale after a difficult sprint failure. Acknowledge the effort, reframe the failure as learning, and set a positive tone for the next iteration.',
        tags: ['Leadership', 'Morale']
      },
      {
        id: 'inspire-2',
        title: 'Overcoming Imposter Syndrome',
        text: 'Generate a supportive guide for a developer feeling imposter syndrome, using empathetic language and practical tips to build confidence and highlight their achievements.',
        tags: ['Coaching', 'Empathy']
      },
      {
        id: 'inspire-3',
        title: 'The Stoic Project Manager',
        text: 'Explain how the Stoic principle of "Control what you can, accept what you cannot" applies to managing project risks and stakeholder expectations, providing 3 practical examples.',
        tags: ['Stoicism', 'Mindset']
      },
      {
        id: 'inspire-4',
        title: 'Why We Celebrate Bugs',
        text: 'Draft an internal blog post titled "Why We Celebrate Bugs", reframing defects not as failures, but as necessary steps in the discovery, learning, and innovation process.',
        tags: ['Culture', 'Innovation']
      },
      {
        id: 'inspire-5',
        title: 'Visionary Product Speech',
        text: 'Write a Steve Jobs-style paragraph introducing a new internal tool. Focus not on the technical features, but on how it fundamentally changes the way the team works for the better.',
        tags: ['Vision', 'Communication']
      }
    ]
  }
];
