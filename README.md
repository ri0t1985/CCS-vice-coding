<div align="center">
  <img src="readme-header.png" alt="dotfiles logo" width="700">
</div>


# Setup

- Create accounts for:
  - [GitHub](https://github.com)
  - [n8n](https://n8n.io/)
  - [Airtop](https://www.airtop.ai/)
  - [Vercel](https://vercel.com/)

- Create repository from template & Add SCRUM issue:
  - **Option 1 (Cursor IDE - Recommended):** 
    
    **If you only have Cursor IDE installed, simply copy and paste this prompt into Cursor:**
    
    ```
    Please set up my GitHub repository. I only have Cursor IDE installed - no PowerShell or GitHub CLI yet.

    Steps to follow:

    1. Detect my operating system (Windows/Mac/Linux)

    2. Check for PowerShell/PowerShell Core and install if missing

    3. Check for GitHub CLI and install if missing

    4. Authenticate with GitHub using browser-based login:
       - Windows PowerShell: "y" | gh auth login --web --git-protocol https --hostname github.com
       - Mac/Linux: echo y | gh auth login --web --git-protocol https --hostname github.com
       This avoids interactive terminal prompts by opening a browser automatically

    5. Download setup-github-template.ps1 from: https://raw.githubusercontent.com/grvermeulen/CCS-Demo/main/setup-github-template.ps1

    6. Ask me what I want to name my repository

    7. Run: powershell -ExecutionPolicy Bypass -File .\setup-github-template.ps1 "REPO_NAME" (Windows) or pwsh -File ./setup-github-template.ps1 "REPO_NAME" (Mac/Linux)

    8. Verify repository, PR, and issue were created

    9. Provide me with the repository URL

    Handle any errors gracefully and guide me through any required user interactions.
    ```
    
    Cursor will handle everything automatically!
  
  - **Option 2 (Manual - Quick Start):**
    1. Clone the template repository to get the setup script:
       ```bash
       gh repo clone grvermeulen/CCS-Demo temp-setup
       cd temp-setup
       ```
    2. Run the setup script:
       ```powershell
       # Windows
       powershell -ExecutionPolicy Bypass -File .\setup-github-template.ps1
       
       # Mac/Linux
       pwsh -File ./setup-github-template.ps1
       ```
    3. The script will:
       - Create your new repository from the template
       - Clone it automatically
       - Fetch the feat/footer-ccs-woerden-issue-19 branch
       - Create a pull request
       - Create a sample scrum issue
    4. (Optional) Delete the temporary template clone:
       ```bash
       cd ..
       rm -rf temp-setup  # or rmdir /s temp-setup on Windows
       ```
  
  - **Option 3 (Manual - GitHub UI):**
    - Go to https://github.com/grvermeulen/CCS-Demo
    - Click "Use this template" button (top right)
    - Create a new repository with your preferred name
    - Clone your new repository
    - The setup script is included - run it to set up the branch and PR

- [Connect your Vercel account to the GitHub repository](https://vercel.com/docs/git#deploying-a-git-repository)
  - Within Vercel, top right click "Add New..."
  - Select "Project"
  - Select your repository (created from template)
  - Import
  - Deploy

- Set your preview environments within Vercel to have no authorization.
  - Within Vercel click on "Settings"
  - Go to "Deployment Protection"
  - Switch off protection for the demo repository.

- Create GitHub API Token :
   
   - **(Manual - Web UI):**
    1. Go to: https://github.com/settings/tokens
    2. Click "Generate new token" -> "Generate new token (classic)"
    3. Name your token (e.g., "n8n-workshop-token")
    4. Select expiration (recommended: 90 days or No expiration for workshop)
    5. Select the following scopes:
       - ✅ `repo` (Full control of private repositories)
       - ✅ `workflow` (Update GitHub Action workflows)
       - ✅ `admin:org` (Full control of orgs and teams)
       - ✅ `admin:repo_hook` (Full control of repository hooks)
       - ✅ `admin:org_hook` (Full control of organization hooks)
    6. Click "Generate token"
    7. **Important:** Copy the token immediately - it's only shown once!
    8. Save it securely - you'll need it for n8n configuration

- [Setup the workflow from the GitHub repository (within n8n directory) in n8n.](https://deltasure.app.n8n.cloud/form/b25ef12d-3026-4345-8130-4126dcd4ba8d)
  - Go to the url and fill in the form. This will trigger the provisioning and setup of your n8n workflow. 
  - Voila


# Workshop

- Vibe code a new feature, make sure to have a related GitHub issue.

- Create a PR to see if the workflow get executed correctly.
  - If you like to skip the above 2 steps you can create a PR for the `line-items-combined` branch.
  - <u>Make sure to create a pull request to your repository, not the original template repository. (change base repository)</u>

- Inspect the steps within the workflow execution to see what happened.

- Copy the payload of your executed run and use it as mock
  - Run the workflow with a manual trigger using the pull request event mock

## Bonus

- Extend the workflow with logic based on the test results.
  - If all tests pass > Approve pull request
  - If any test failed > Request changes on the pull request

- Vibe code another feature of your choice and let it go through the workflow.
  - Create a scrum issue of you new feature
  - Vibe code your new feature
  - Create a pull request and see how the pipeline is used

- Whatever you feel like extending the pipeline or agentic capabilities. 😃
