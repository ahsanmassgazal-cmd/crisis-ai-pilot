# ROLLBACK INSTRUCTIONS: Crisis AI Pilot

## 1. Production Deployment Information
- **Live Production URL:** https://crisis-ai-pilot.sigmamaxaisolutions.com
- **Vercel Canonical URL:** https://crisis-ai-pilot.vercel.app
- **Baseline Deployment ID:** `dpl_CocQoKmJiku2Hhs4GqzscUojsui9`
- **Baseline Git Tag:** `baseline-before-audit-20261125`
- **Working Git Branch:** `audit-fix`

## 2. Emergency Rollback Commands
In the event of an unintended breaking change on production:

### Option A: Vercel CLI Instant Rollback
```bash
npx vercel rollback dpl_CocQoKmJiku2Hhs4GqzscUojsui9
```

### Option B: Promote Previous Deployment
Navigate to the Vercel Dashboard:
`https://vercel.com/ahsanmassgazal-cmd/crisis-ai-pilot/deployments`
Select deployment `dpl_CocQoKmJiku2Hhs4GqzscUojsui9` and click "Promote to Production".

### Option C: Git Revert to Baseline Tag
```bash
git checkout main
git reset --hard baseline-before-audit-20261125
git push origin main --force
npx vercel --prod --yes
```

## 3. Code Backup Archive
- **Path:** `%USERPROFILE%\Downloads\SigmaMax_Backups\crisis-ai-pilot\crisis-ai-pilot_code_20261125-1644.zip`
