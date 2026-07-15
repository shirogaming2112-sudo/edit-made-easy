## Replace device sample screenshots with uploaded images

Swap the AI-generated Windows and macOS sample images in the Work Setup step with the two screenshots the user just uploaded, kept as regular bundled PNG files (no `.asset.json`).

### Steps
1. Copy the uploads into the repo as real PNGs:
   - `user-uploads://windows-2.png` → `src/assets/device-sample-windows.png` (overwrite)
   - `user-uploads://Mac-2.png` → `src/assets/device-sample-mac.png` (overwrite)
2. Leave `src/components/steps/WorkSetupStep.tsx` as-is — it already does:
   ```ts
   import windowsSampleImg from '@/assets/device-sample-windows.png';
   import macSampleImg from '@/assets/device-sample-mac.png';
   ```
   so the new files are picked up automatically by Vite.
3. Confirm no stale `.asset.json` pointers remain next to those PNGs.

### Out of scope
No changes to the modal layout, tab logic, or any other Work Setup behavior.
