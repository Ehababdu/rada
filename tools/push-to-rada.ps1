Param(
    [string]$RemoteUrl = 'https://github.com/Ehababdu/rada.git',
    [string]$RemoteName = 'rada',
    [switch]$Force,
    [string]$NewBranchName = ''
)

function Fail($msg) {
    Write-Error $msg
    exit 1
}

# ensure inside git repo
if (-not (git rev-parse --is-inside-work-tree 2>$null)) {
    Fail 'Not inside a git repository.'
}

$branch = git rev-parse --abbrev-ref HEAD 2>$null
if (-not $branch) { Fail 'Could not determine current branch.' }

Write-Output "Current branch: $branch"

# add remote if missing
$existing = git remote get-url $RemoteName 2>$null
if (-not $existing) {
    git remote add $RemoteName $RemoteUrl 2>$null || Fail "Failed to add remote $RemoteName -> $RemoteUrl"
    Write-Output "Added remote '$RemoteName' -> $RemoteUrl"
} else {
    Write-Output "Remote '$RemoteName' already exists: $existing"
}

git fetch $RemoteName 2>$null

# check if remote branch exists
$remoteBranchExists = git ls-remote --heads $RemoteName $branch 2>$null | Select-String $branch

if ($remoteBranchExists -and -not $Force) {
    if (-not $NewBranchName) {
        $short = git rev-parse --short HEAD 2>$null
        $NewBranchName = "$branch-from-local-$short"
    }
    Write-Output "Remote branch '$branch' exists. Pushing local '$branch' to remote branch '$NewBranchName' on $RemoteName"
    git push -u $RemoteName "$branch:$NewBranchName" || Fail 'Push failed.'
    Write-Output "Pushed to $RemoteName/$NewBranchName"
    exit 0
}

if ($Force) {
    Write-Output "Force-pushing local '$branch' to $RemoteName/$branch"
    git push -u --force $RemoteName $branch || Fail 'Force push failed.'
    Write-Output "Force-pushed to $RemoteName/$branch"
    exit 0
}

# default: push to same branch name
Write-Output "Pushing local '$branch' to $RemoteName/$branch"
git push -u $RemoteName $branch || Fail 'Push failed. Remote may have diverged; retry with -Force or specify -NewBranchName.'
Write-Output "Pushed to $RemoteName/$branch"
