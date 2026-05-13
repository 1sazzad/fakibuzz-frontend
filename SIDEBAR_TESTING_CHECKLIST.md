# Sidebar Testing Checklist

## Pre-Testing Setup
- [ ] Dev server running on http://localhost:5175 (or configured port)
- [ ] No compile errors in terminal
- [ ] Browser dev console clear of errors
- [ ] localStorage enabled in browser

## Visual Testing

### Expanded State (Default)
- [ ] Sidebar appears on desktop (lg breakpoint and above)
- [ ] Sidebar width is approximately 288px (w-72)
- [ ] Brand logo with full text visible: "FakiBuzz"
- [ ] Tagline visible: "Exam intelligence for learners"
- [ ] Collapse button visible (← arrow icon)
- [ ] User info card visible with:
  - [ ] Role label (e.g., "STUDENT" or "SUB ADMIN")
  - [ ] User full name or email
  - [ ] Email shown below name
- [ ] Menu items visible with icons and text:
  - [ ] 👤 Profile
  - [ ] 📚 Subjects
  - [ ] 💡 Suggestions
  - [ ] 🔨 Answer Builder
  - [ ] 🤝 Support
  - [ ] 💬 Contact / Feedback
- [ ] Logout button visible at bottom: "Logout" text
- [ ] Smooth border separators between sections

### Collapsed State
- [ ] Sidebar width reduces to approximately 80px (w-20)
- [ ] Animation takes ~300ms (smooth transition visible)
- [ ] Brand replaces with single "F" icon in indigo box
- [ ] Collapse button visible (→ arrow icon)
- [ ] User info card hidden completely
- [ ] Menu items show only emoji icons, centered
- [ ] Icons remain visible and accessible
- [ ] Logout button shows only emoji: 🚪
- [ ] Menu items still have active state highlighting

## Interaction Testing

### Collapse/Expand Button
- [ ] Click collapse button → sidebar shrinks with animation
- [ ] Click expand button → sidebar expands with animation
- [ ] Button tooltip shows on hover:
  - [ ] Expanded state: "Collapse sidebar"
  - [ ] Collapsed state: "Expand sidebar"
- [ ] Multiple clicks work smoothly
- [ ] No lag or jank during transition

### Menu Items
- [ ] Each menu item is clickable in expanded mode
- [ ] Each menu item is clickable in collapsed mode
- [ ] Active page highlighted in indigo (indigo-50 background, indigo-700 text)
- [ ] Hover effect works: background changes to slate-100, text to slate-950
- [ ] Clicking menu item navigates to correct page
- [ ] Active state persists on page load

### Tooltips (Collapsed Mode Only)
- [ ] Hover over Profile icon → shows "Profile" tooltip
- [ ] Hover over Subjects icon → shows "Subjects" tooltip
- [ ] Hover over each menu item → shows corresponding label
- [ ] Tooltip appears after short delay (browser default)
- [ ] Tooltip disappears on mouse out

### Logout Button
- [ ] Expanded: Shows "Logout" text, clickable
- [ ] Collapsed: Shows "🚪" emoji, clickable
- [ ] Click logout:
  - [ ] User logged out
  - [ ] Redirects to homepage
  - [ ] PublicNavbar appears (not sidebar)

### Brand Link
- [ ] Expanded: Click full brand area → navigate to homepage
- [ ] Collapsed: Click "F" icon → navigate to homepage
- [ ] Links work from all pages

## Scrolling Behavior

### Menu Scrolling (trigger on small window)
- [ ] Resize browser to height < 800px
- [ ] If menu items exceed space, scrollbar appears in sidebar
- [ ] Scroll menu items smoothly (no jank)
- [ ] Logout button stays visible at bottom (doesn't scroll away)
- [ ] Main page content doesn't scroll (only sidebar scrolls)
- [ ] No horizontal scrollbar appears anywhere

### Resize Testing
- [ ] Resize window while collapsed → remains collapsed
- [ ] Resize window while expanded → remains expanded
- [ ] Collapse, then resize window → stays collapsed
- [ ] Sidebar width doesn't change unexpectedly on resize

## Responsive Design

### Desktop (≥1024px / lg)
- [ ] Sidebar fully visible
- [ ] Collapse/expand works
- [ ] Main content padding adjusts

### Tablet (768px - 1023px / md)
- [ ] Sidebar fully visible
- [ ] Collapse/expand works
- [ ] Main content padding adjusts

### Mobile (< 768px)
- [ ] Sidebar hidden
- [ ] Hamburger menu button visible (if not already visible)
- [ ] Mobile drawer/menu works as before
- [ ] No changes to mobile experience

## Content Spacing

### Main Content Area
- [ ] Expanded state: Content padding-left ≈ 288px (content doesn't hide under sidebar)
- [ ] Collapsed state: Content padding-left ≈ 80px (content doesn't hide under sidebar)
- [ ] Padding transitions smoothly with sidebar width
- [ ] No content overlaps with sidebar
- [ ] No content cuts off at edges

### Specific Pages
- [ ] Subjects page: Content properly spaced
- [ ] Suggestions page: Content properly spaced
- [ ] Profile page: Forms don't overlap sidebar
- [ ] Dashboard page: Cards properly spaced
- [ ] Admin pages: Content properly spaced

## State Persistence

### localStorage Testing
- [ ] Start with default (expanded)
- [ ] Click collapse button
- [ ] Open browser dev tools → Application → localStorage
- [ ] Look for key: `sidebar_collapsed`
- [ ] Value should be: `true` (when collapsed)
- [ ] Refresh page (F5)
- [ ] Sidebar should still be collapsed
- [ ] Collapse button should show expand arrow

### Persistence Tests
- [ ] Expand sidebar
- [ ] Verify localStorage: `sidebar_collapsed = false`
- [ ] Refresh page
- [ ] Sidebar should be expanded
- [ ] Collapse sidebar
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Navigate to app
- [ ] Sidebar should still be collapsed
- [ ] Repeat expand/collapse multiple times
- [ ] State should persist consistently

## Navigation Testing

### Route Navigation
- [ ] All menu items link to correct routes
- [ ] Profile → /profile ✓
- [ ] Subjects → /subjects ✓
- [ ] Suggestions → /suggestions ✓
- [ ] Answer Builder → /answers ✓
- [ ] Support → /support ✓
- [ ] Contact/Feedback → /feedback ✓
- [ ] (Admin routes if testing admin)

### Active Route Highlighting
- [ ] Navigate to /profile → Profile item highlighted
- [ ] Navigate to /subjects → Subjects item highlighted
- [ ] Navigate to /suggestions → Suggestions item highlighted
- [ ] Highlighting persists while collapsed
- [ ] Highlighting persists while expanded

### Deep Linking
- [ ] Direct URL to /subjects shows sidebar highlighted
- [ ] Direct URL to /feedback shows sidebar highlighted
- [ ] Works in both expanded and collapsed states

## Edge Cases

### No Menu Items (shouldn't happen, but test):
- [ ] Empty menu list renders without error
- [ ] Logout button still visible

### Long User Names/Emails
- [ ] User name with long text:
  - [ ] Expanded: Text truncated with ellipsis
  - [ ] Email also truncated
  - [ ] Tooltip shows full text on hover (if implemented)

### Rapid Collapse/Expand
- [ ] Click collapse button multiple times rapidly
- [ ] No console errors
- [ ] Final state matches last click
- [ ] Animation completes smoothly

### Tab Switching (Browser Tabs)
- [ ] User in tab 1, expand sidebar
- [ ] Switch to tab 2, then back to tab 1
- [ ] Sidebar state should be same (expanded)
- [ ] Same localStorage across tabs in same window

## Performance Testing

### Animation Smoothness
- [ ] Open DevTools Performance tab
- [ ] Record collapse/expand action
- [ ] Should maintain 60fps or close to it
- [ ] No frame drops during transition

### Memory
- [ ] Sidebar state is minimal (just boolean)
- [ ] No memory leaks from toggle clicks
- [ ] No unused event listeners

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through sidebar elements
- [ ] Collapse button receives focus (visible outline)
- [ ] Menu items receive focus (visible outline)
- [ ] Logout button receives focus (visible outline)
- [ ] Enter/Space activates buttons

### Screen Reader (if using NVDA/JAWS)
- [ ] Sidebar announced as navigation
- [ ] Collapse button announced with purpose
- [ ] Menu items announced with labels
- [ ] Links are properly announced
- [ ] Logout button announced correctly

### Color Contrast (collapsed mode)
- [ ] Icons against background have sufficient contrast
- [ ] Active state has sufficient contrast
- [ ] Hover states have sufficient contrast
- [ ] Text is readable at normal zoom

## Bug Hunting

### Console Errors
- [ ] Open DevTools Console
- [ ] No errors after collapse/expand
- [ ] No errors on page navigation
- [ ] No warnings about missing props

### Performance Issues
- [ ] No lag when clicking collapse
- [ ] No delay in route navigation
- [ ] Animation doesn't stutter
- [ ] Scrolling is smooth

### Visual Issues
- [ ] No text overlap
- [ ] No icons misaligned
- [ ] No buttons cut off
- [ ] Borders align properly
- [ ] No unexpected gaps

## Admin Testing (if applicable)

### Admin Routes
- [ ] Dashboard item highlighted when on admin dashboard
- [ ] Upload item highlighted when on upload page
- [ ] Questions item highlighted when on questions page
- [ ] Subjects item highlighted when on subjects page
- [ ] All admin items visible in menu
- [ ] Collapse/expand works for admin sidebar

### Super Admin
- [ ] Universities item visible (if super admin)
- [ ] Departments item visible (if super admin)
- [ ] Items positioned correctly in menu

## Final Verification

- [ ] All main features working
- [ ] No console errors
- [ ] No broken routes
- [ ] localStorage persists correctly
- [ ] Responsive on all screen sizes
- [ ] Mobile unaffected
- [ ] Performance acceptable
- [ ] Accessibility maintained

## Sign-Off
- Tester: ________________
- Date: ________________
- Status: ☐ Pass ☐ Fail ☐ Pass with notes
- Notes: _______________________________________________
