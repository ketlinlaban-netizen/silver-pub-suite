# Dispensing Cans & Staff Management Feature Spec

## Overview
Add admin dispensing can management with pricing, cashier open/close dispensing sessions, and admin staff creation with password management.

## Features

### 1. Admin Dispensing Can Management
- **Add Dispensing Can**: Admin can add cans with name and price per unit
- **Edit Can Price**: Admin can update can price (with audit trail)
- **Enable/Disable**: Toggle can visibility to cashiers
- **View Pricing**: See current prices and linked products

**Database Schema Changes Needed**:
```sql
ALTER TABLE public.dispensing_units 
ADD COLUMN price_per_unit NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN unit_type TEXT NOT NULL DEFAULT 'can',
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.dispensing_sessions 
ADD COLUMN opening_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN price_per_unit_snapshot NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN closing_notes TEXT;
```

### 2. Cashier Open Dispensing Session
- **Select Active Can**: Cashier sees only active cans with price
- **Enter Opening Units**: Cashier enters initial quantity (e.g., 24 units)
- **Auto Calculate Revenue**: System shows expected revenue (qty × price)
- **Open Session**: Session records opening quantity, time, and expected revenue

**Flow**:
1. Cashier clicks "Open Dispensing"
2. Selects can from list
3. Enters opening quantity
4. System calculates expected revenue = quantity × price_per_unit
5. Session opens with:
   - opening_quantity
   - opening_revenue
   - price_per_unit_snapshot (freezes price at session open)
   - expected_revenue = opening_revenue
   - is_closed = false

**Display to Cashier**:
- Expected active units: {opening_quantity}
- Outstanding: 0 (just opened)
- Expected revenue: {opening_revenue}

### 3. Cashier Close Dispensing Session
- **Enter Collected Amount**: How much cash received (e.g., 3,200 KES)
- **Enter Returned Units**: Units not dispensed/returned (e.g., 2 units)
- **View Reconciliation**: System shows expected vs collected
- **Close Session**: Records collected amount and outstanding balance

**Flow**:
1. Cashier clicks "Close" on open session
2. Enters collected amount
3. Enters returned quantity (optional)
4. System calculates:
   - dispensed_quantity = opening_quantity - returned_quantity
   - expected_revenue = dispensed_quantity × price_per_unit_snapshot
   - outstanding = expected_revenue - collected_revenue
5. Session closes with calculated values

**Display to Cashier**:
```
CLOSING SUMMARY
═══════════════════════════════════════
Unit: {name}
Opened: {opening_time} | Closed: {closing_time}

Opening Quantity:     {opening_qty} units
Returned Quantity:    {returned_qty} units
─────────────────────────────────────
Dispensed Quantity:   {dispensed_qty} units

Price per Unit:       {price} KES
Expected Revenue:     {expected} KES
Collected Amount:     {collected} KES
─────────────────────────────────────
Outstanding:         {outstanding} KES
═══════════════════════════════════════
```

### 4. Admin Staff Creation
- **Create New Staff**: Admin enters full name, phone, password
- **Auto Generate**: System creates auth user and profile
- **Send Credentials**: Admin shares password out-of-band
- **Reset Password**: Admin can reset staff password

**Staff Fields**:
- Full name (required)
- Phone (required)
- Email (auto-generated from phone or provided)
- Password (system-generated, admin can set)
- Role (dropdown: Cashier, Manager, Admin, etc.)
- Status (Active, Suspended, Terminated)

**Database Flow**:
1. Admin fills staff form
2. System creates:
   - auth.users entry (via trigger or direct)
   - profiles entry with full_name, phone, email
   - user_roles entry with selected role
3. Generate temp password (or use admin-provided)
4. Display credentials for admin to share

### 5. Admin Reset Staff Password
- **Select Staff**: Pick staff member from list
- **Generate New Password**: System generates or admin sets
- **Display**: Show new temporary password
- **Staff Changes**: Staff must change on next login

## Implementation Status

- [x] Schema planning (done by requirement-detailer)
- [ ] Database migrations (Supabase - add price_per_unit, opening_revenue, etc.)
- [ ] dispensing.tsx updates (UI for admin & cashier flows)
- [ ] staff.tsx updates (add creation & password reset)
- [ ] Supabase RLS policies (ensure cashiers only see active cans)
- [ ] Testing & validation

## Next Steps

1. **Apply database schema changes in Supabase**
2. **Update dispensing.tsx** with admin can management UI and cashier open/close flows
3. **Update staff.tsx** with staff creation form and password reset
4. **Test flows** with test cashier and admin accounts
5. **Build & deploy**

## Important Notes

- Price is captured at session open (price_per_unit_snapshot) so historical accuracy is maintained
- Outstanding balance = expected_revenue - collected_revenue
- Cashier never manages prices, only opens/closes
- Admin has full control over can setup and staff management
- All sessions are audited and immutable once closed
