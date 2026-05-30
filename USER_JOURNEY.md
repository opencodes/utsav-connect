# ShubhE — User Journeys
### Festive Food Delivery & Admin Portal

*ShubhE* is a full-featured, Indian festival-themed gourmet food delivery and celebration management ecosystem. It seamlessly bridges the gap between top-tier culinary vendors, professional event planners, and retail consumers wanting traditional delicacies. 

This document maps out the specific, interactive end-to-end user journeys for the platform's three core personas:
1. **The End User (Standard Customer / Feast Organizer)**
2. **The Event Planner (Celebration Workspace Manager)**
3. **The Food Vendor (Gourmet Partner / Catering Chef / traditional Halwai)**

---

## ─── PERSONA 1: THE END USER (RETAIL CUSTOMER) ───
**Objective:** Easily discover traditional festival specials, order from premium local kitchens, check out using integrated regional wallets, and manage micro-celebrations.

```
 [ Discover & Browse ] ➔ [ Customize Feast ] ➔ [ Loyalty Wallet Checkout ] ➔ [ Order Tracking & Support ]
```

### Phase 1: Cultural Discovery & Onboarding
* **Landing on ShubhE:** The user is greeted by a visual palette representing Indian festive traditions (marigold details, warm golden lanterns, auspicious visual accents).
* **Location & Event Setup:** They set their target delivery city (e.g., Varanasi, Lucknow, Jaipur, Mumbai) or specify an upcoming celebratory occasion directly on the homepage banner to filter the best-suited neighborhood kitchens.
* **Authentication:** A secure, intuitive customer login pathway ensures they have direct access to their historical addresses, personal profile stats, and dynamic wallet balance.

### Phase 2: The Interactive Menu & Filter Pathway
* **Category Exploration:** The customer browses authentic collections structured by culinary categories (such as *Mithai Essentials*, *Royal Platters*, *Pure-Veg Feast*, *Street Treats*, and *Festival Special Deals*).
* **Gourmet Filtering:** They toggle interactive layout filters:
  * **Pure Veg & Jain Prefs:** Isolating purely vegetarian options.
  * **Popularity & Ratings:** Sifting top tier-rated home kitchens.
  * **Festival Deals:** Finding exclusive cashback or custom platter deals.
* **Individual Restaurant details:** Tapping into a restaurant reveals their detailed menu (individual items, descriptions, rating counts, pricing, safety/veg-markers) along with interactive best-seller tags.

### Phase 3: Cart Orchestration & Secure Checkout
* **Cart Assembly:** The user selects portions, customizes choices (adding festive extras and single or bulk portions), and dynamically updates their central checkout tray.
* **Ecosystem Loyalty & Payment:** 
  * They verify delivery locations or select between saved work/home addresses.
  * Instead of standard checkout, they view their dedicated, computed Loyalty Metrics:
    * **Wallet Balance:** Real-time credit/debit transaction logs.
    * **Royalty Coins:** Accrued bonus tier points earned from previous celebratory orders, allowing instant redemptions.

### Phase 4: Fulfillment & Care
* **Vibrant Progress Tracker:** Once placed, the order transitions dynamically through key preparation stages (*Pending*, *Preparing*, *Out for Delivery*, and *Delivered*).
* **Direct Helpdesk:** If any discrepancy arises, the user can lodge interactive support tickets, chat with assigned support, or look up comprehensive cancellation and refund guidelines.

---

## ─── PERSONA 2: THE EVENT PLANNER ───
**Objective:** Elevate a standard consumer account into an administrative workspace to orchestrate multi-course feasts, allocate vendors, track budgets, and manage traditional gift registries.

```
 [ Planner Upgrading ] ➔ [ Central Command HQ ] ➔ [ Ritual & Feast Design ] ➔ [ Guest, Budget & Shagun Logs ]
```

### Phase 1: Onboarding the Celebration Executive
* **Registration:** A standard customer registers their planner status via `/event-planner/register` by inputting their agency credentials, primary city, active region, and portfolio details.
* **Workspace Initialization:** Upon approval, their admin profile morphs to display the deep-tech **"Event Planner Workspace"** option, moving them directly into their private planning control center (`/admin/planner-dashboard`).

### Phase 2: The Central Workspace Dashboard
The Planner Workspace is structured into a command center displaying high-level visual telemetry cards:
* **Event Summaries:** Active dates, countdown indicators to main ceremonies, and venue lookups.
* **Guest & RSVP Feeds:** Instant percentage metrics on invited guests vs. checked-in RSVPs.
* **Budget Metrics:** Vertical interactive bar graphs tracking paid advances against projected liabilities.
* **Alert Center:** Notification chips warning of pending invoices, unassigned vendor feasts, or low inventory counts for specific ritual materials.

### Phase 3: Event Lifecycle & Ritual Mapping
* **Creating a Celebration:** The planner initiates the lifecycle by adding a master event record (e.g., *"Shreyas & Anjali's Royal Wedding"* or *"Varanasi Ganga Dev Utsav"*), choosing a thematic design package (e.g., *Mithila Heritage*, *Contemporary*, or *Royal Palace*).
* **Sub-Event Segmentation:** Since Indian celebrations span multiple days, the planner breaks the celebration into specific **Rituals** (e.g., *Haldi*, *Sangeet*, *Main Phere*, *Grand Feast Reception*), assigning dates, localized venues, and custom timelines for each ritual segment.

### Phase 4: Feast Management & Vendor Curations (The Feast Engine)
* **Defining the Platter:** For each distinct ritual, the planner navigates to the **Planner Feast** console to map out specific courses:
  * *Appetizers & Starters* (e.g., Paneer Tikka, Traditional Chaat counters).
  * *Mains & Curries* (e.g., Dal Makhani, Dum Biryani).
  * *Breads & Rice*.
  * *Traditional Desserts* (e.g., Hot Gulab Jamuns, Shahi Tukda).
* **Vendor Bidding & Matching:** Planners scan approved, premium local food brands on **Planner Vendors** and directly link those culinary partners to specific courses, streamlining coordination.

### Phase 5: Multi-Module Operations (Operational Tabs)
The planner uses highly specialized tools inside their workspace:
* **Planner Budget Tracker:** An accounting sheet to record venue, clothing, decoration, and food expenses, documenting paid advances and remaining balances with automated state recalculations.
* **Planner Guests Directory:** A digital guest roster tracking RSVPs, assigned tables, and strict dietary notes (e.g., *Jain Veg*, *Nut Allergy*, *High-Sugar/Diabetic-safe*).
* **Planner Inventory Console:** A central checklist keeping count of essential ceremony materials (e.g., pooja thalis, marigold chains, sweet giveaway boxes, custom clay teacups).
* **Planner Chuman (Sneh/Shagun Ledger):** A digitally crafted traditional registry that logs gifts of cash and jewelry or physical offerings gifted during key ceremonies. Planners log:
  * Guest Name
  * Gift Category (*Cash* vs. *Physical Item* like a gold coin or brass set)
  * Estimated Market Value (shagun sum)
  * Unique Date of presentation and personalized note blocks to ensure thanks/credit is correctly addressed after the busy event closes.

---

## ─── PERSONA 3: THE VENDOR (GOURMET PARTNER) ───
**Objective:** Register kitchen operations, pass regulatory validations, build a specialized digital catalog of Indian festivity foods, and fulfill large-scale caterings.

```
 [ Service Listing ] ➔ [ Menu Crafting ] ➔ [ Admin Approval ] ➔ [ Bulk Order Fulfillment ]
```

### Phase 1: Commercial Registration
* **Initiating Listing:** Gourmet chefs, catering operators, and sweet makers sign up via `/list-your-service` (`VendorRegistrationPage.tsx`).
* **Operational Footprint:** They define their operational capacity:
  * Minimum event order threshold sizes.
  * Active states/districts utilizing cascading regional selector fields.
  * Specialities (e.g., Awadhi Cuisines, Traditional Rajasthani Thali, South Indian Tiffin).

### Phase 2: Culinary Catalog & Specialty Crafting
* **Menu Architecture:** Vendors customize their digital store profiles under the admin panels, uploading details of individual dishes, ingredients, dietary categories, and pricing.
* **Traditional Packaging Options:** They can opt to categorize items with specific "Festive Special" tags or package them as pre-bundled group sweets cases designed for high-end micro-gourmet deliveries.

### Phase 3: Platform Approval & Quality Assurance
* **Moderation Loop:** Newly registered vendors enter a *Pending* administrative buffer status.
* **Admin Verification:** Platform administrators access the master commerce dashboard (`/admin/vendor-approvals` tab) to inspect culinary certification documents, review commercial terms, change status to *Approved*, and map the vendor to relevant celebration category tiers.

### Phase 4: Large-Scale Feast Handshake & Revenue Performance
* **Catering Matches:** Once approved, the vendor is listed live under the customer directory and the planner's marketplace dashboard.
* **Order Stream Integration:** Vendors monitor incoming transactions:
  * Direct customer retail deliveries via the fast cart checkout system.
  * Bulk reservations requested by professional event planners for multi-day ritual menus.
* **Performance Telemetry:** Through the commerce panel, they review total orders received, generated revenue trends, customer growth metrics, and dynamic review histories.

---

## ── Summary of Persona Access Points ──

| Access/Action Point | Retail Customer (End User) | Event Planner | Food Vendor |
| :--- | :---: | :---: | :---: |
| **Primary Route** | `/` (Home) -> `/vendors` | `/admin/planner-dashboard` | `/list-your-service` |
| **Main Objectives** | Fast delivery, sweet boxes, orders | Event control, menu design, RSVPs | Menu configuration, approvals |
| **Ecosystem Tools** | Digital wallet, royalty coins, support | Budget, Feasts, Chuman, Materials | Business analytics, menu metrics |
| **Authentication Level** | Standard Customer Auth | Upgraded Planner Admin Privilege | Registered Commerce Account |
