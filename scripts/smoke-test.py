#!/usr/bin/env python3
"""Smoke test for the Cyberbacker Profile Builder.

Verifies:
  1. /source/:name renders the Welcome step in a fresh session.
  2. The home route loads the wizard / Welcome step.
  3. The NDA modal opens via Sign Up → Continue Building My Profile.

Usage:
  python3 scripts/smoke-test.py [BASE_URL]
  (defaults to http://localhost:8080)
"""
import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
OUT = Path(__file__).parent.parent / ".smoke-screenshots"
OUT.mkdir(exist_ok=True)


async def expect_visible(page, selector, label):
    el = page.locator(selector).first
    await el.wait_for(state="visible", timeout=10_000)
    print(f"  ✓ {label}")


async def run():
    failures: list[str] = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()
        console_errors: list[str] = []
        page.on("pageerror", lambda e: console_errors.append(f"pageerror: {e}"))
        page.on(
            "console",
            lambda m: console_errors.append(f"console.error: {m.text}")
            if m.type == "error"
            else None,
        )

        # 1. Home route shows the Welcome step.
        print("[1] GET /")
        try:
            await page.goto(f"{BASE}/", wait_until="networkidle")
            await expect_visible(page, "text=Cyberbacker Profile Builder", "Welcome heading")
            await expect_visible(page, "input[type='email']", "Email input")
            await page.screenshot(path=str(OUT / "home.png"))
        except Exception as e:
            failures.append(f"home: {e}")

        # 2. /source/:name in a fresh context renders the wizard.
        print("[2] GET /source/test-campaign?ref=abc123 (fresh session)")
        try:
            fresh_ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
            fresh_page = await fresh_ctx.new_page()
            await fresh_page.goto(
                f"{BASE}/source/test-campaign?ref=abc123", wait_until="networkidle"
            )
            await expect_visible(
                fresh_page, "text=Cyberbacker Profile Builder", "Welcome heading on /source/:name"
            )
            await fresh_page.screenshot(path=str(OUT / "source.png"))
            await fresh_ctx.close()
        except Exception as e:
            failures.append(f"source: {e}")

        # 3. NDA modal opens via the signup → continue flow.
        print("[3] Open NDA modal")
        try:
            await page.get_by_role("button", name="Create My Profile").click()
            await expect_visible(page, "text=Account Creation", "Signup dialog")
            await page.locator("input[type='email']").last.fill("smoke@test.dev")
            pwd_inputs = page.locator("input[type='password']")
            await pwd_inputs.nth(0).fill("Password123")
            await pwd_inputs.nth(1).fill("Password123")
            await page.get_by_role("button", name="Continue Building My Profile").click()
            await expect_visible(page, "text=NON-DISCLOSURE AGREEMENT", "NDA modal heading")
            await expect_visible(
                page,
                "text=I have read and agree to the terms of the Non-Disclosure Agreement",
                "NDA agreement checkbox label",
            )
            await page.screenshot(path=str(OUT / "nda.png"))
        except Exception as e:
            failures.append(f"nda: {e}")

        await browser.close()

        if console_errors:
            print("\nConsole / page errors observed:")
            for e in console_errors:
                print(" ", e)

        if failures:
            print("\nFAILURES:")
            for f in failures:
                print(" ", f)
            sys.exit(1)
        print(f"\nAll smoke checks passed. Screenshots in {OUT}/")


if __name__ == "__main__":
    asyncio.run(run())
