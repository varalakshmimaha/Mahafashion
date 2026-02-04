---
description: Implementation Plan for Order Management Module
---

# Order Management Implementation Plan

This plan outlines the steps to upgrade the Order Management module to meet advanced requirements.

## Phase 1: Order List View (Filtering & Sorting)
- [x] Update `OrderController::index` to handle filtering and sorting parameters.
- [x] Update `index.blade.php` to wrap filters in a GET form and include sorting links.
- [x] Fix attribute naming consistency (`total` vs `total_amount`) in views.
- [x] Implement Bulk Selection UI (checkboxes) and Bulk Action form handling.

## Phase 2: Order Details & Workflow
- [x] Enhance `OrderController::show` to include comprehensive details (notes, activity log).
- [x] Improve `show.blade.php` layout (Customer info, detailed items list, timeline).
- [x] Implement internal notes system (Add Note endpoint).
- [x] Create "Shipping/Tracking" modal and update logic.

## Phase 3: Invoicing & Export
- [ ] Create invoice generation (PDF) using a library like `barryvdh/laravel-dompdf`.
- [ ] Implement "Export to CSV" functionality in `OrderController::export`.

## Phase 4: Order Status Workflow
- [ ] Implement state machine logic or robust status transition checks.
- [ ] Ensure email notifications trigger on status changes (Listeners/Events).

## Phase 5: Customer Management Module
(To be detailed after Order Management is stable)
