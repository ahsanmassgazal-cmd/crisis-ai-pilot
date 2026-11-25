# ROLLBACK INSTRUCTIONS: Crisis AI Pilot

## 1. Instant Production Rollback (Primary Method)
The primary rollback method is **instantaneous alias reassignment** via the Vercel CLI without rebuilding:

```bash
vercel rollback <deployment-id-or-url>
```

### Specific Target Deployments:
- **Immediate Previous Deployment (Audit Baseline):**
  ```bash
  vercel rollback dpl_CocQoKmJiku2Hhs4GqzscUojsui9
  ```
- **Or via CLI Interactive Prompt:**
  ```bash
  vercel rollback
  ```
  *(Select the last verified production deployment from the interactive list)*

---

## 2. Instant Dashboard Rollback (Alternative UI Method)
1. Go to: `https://vercel.com/ahsanmassgazal-cmd/crisis-ai-pilot/deployments`
2. Locate the previous healthy deployment (e.g., `dpl_CocQoKmJiku2Hhs4GqzscUojsui9` or current active backup).
3. Click the **"..."** context menu and select **"Instant Rollback"** (or **"Promote to Production"**).
4. Traffic instantly routes to the previous deployment with 0 seconds build time.

---

## 3. Deployment Identifiers Reference
- **Live Production URL:** `https://crisis-ai-pilot.sigmamaxaisolutions.com`
- **Vercel Canonical URL:** `https://crisis-ai-pilot.vercel.app`
- **Current Production Deployment ID:** `dpl_379KBGUHwdiEwyxg2jN23S6kDBCg`
- **Previous Stable Deployment ID:** `dpl_CocQoKmJiku2Hhs4GqzscUojsui9`
- **Git Baseline Tag:** `baseline-before-audit-20261125`
- **Offline Code Backup:** `_backups/crisis-ai-pilot_code_20261125-1644.zip`
