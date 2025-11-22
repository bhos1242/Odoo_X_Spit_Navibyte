import {
    PrismaClient,
    UserRole,
    ProductType,
    LocationType,
    TransferType,
    TransferStatus,
    ContactType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seeding...");

    // 1. User
    const email = "bhosalenaresh73@gmail.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: UserRole.ADMIN,
            password: hashedPassword,
        },
        create: {
            email,
            name: "Naresh Bhosale",
            password: hashedPassword,
            role: UserRole.ADMIN,
        },
    });

    console.log({ user });
    const userId = user.id;

    // 2. Warehouses & Locations
    console.log("Seeding Locations...");

    // Vendor Location (Virtual)
    const vendorLocation = await prisma.location.upsert({
        where: { shortCode_userId: { shortCode: "PARTNER/VENDOR", userId } },
        update: {},
        create: {
            name: "Vendors",
            shortCode: "PARTNER/VENDOR",
            type: LocationType.VENDOR,
            userId,
        },
    });

    // Customer Location (Virtual)
    const customerLocation = await prisma.location.upsert({
        where: { shortCode_userId: { shortCode: "PARTNER/CUSTOMER", userId } },
        update: {},
        create: {
            name: "Customers",
            shortCode: "PARTNER/CUSTOMER",
            type: LocationType.CUSTOMER,
            userId,
        },
    });

    // Inventory Adjustment (Virtual)
    const adjustmentLocation = await prisma.location.upsert({
        where: { shortCode_userId: { shortCode: "VIRTUAL/ADJUST", userId } },
        update: {},
        create: {
            name: "Inventory Adjustment",
            shortCode: "VIRTUAL/ADJUST",
            type: LocationType.INVENTORY_LOSS,
            userId,
        },
    });

    // Main Warehouse
    const warehouse = await prisma.warehouse.upsert({
        where: { shortCode_userId: { shortCode: "WH", userId } },
        update: {},
        create: {
            name: "Main Warehouse",
            shortCode: "WH",
            address: "123 Main St, Logistics City",
            userId,
        },
    });

    // Main Stock Location (Internal)
    const stockLocation = await prisma.location.upsert({
        where: { shortCode_userId: { shortCode: "WH/STOCK", userId } },
        update: {},
        create: {
            name: "Stock",
            shortCode: "WH/STOCK",
            type: LocationType.INTERNAL,
            warehouseId: warehouse.id,
            userId,
        },
    });

    // Shelf 1
    const shelf1 = await prisma.location.upsert({
        where: { shortCode_userId: { shortCode: "WH/STOCK/SHELF1", userId } },
        update: {},
        create: {
            name: "Shelf 1",
            shortCode: "WH/STOCK/SHELF1",
            type: LocationType.INTERNAL,
            parentId: stockLocation.id,
            warehouseId: warehouse.id,
            userId,
        },
    });

    // Shelf 2
    const shelf2 = await prisma.location.upsert({
        where: { shortCode_userId: { shortCode: "WH/STOCK/SHELF2", userId } },
        update: {},
        create: {
            name: "Shelf 2",
            shortCode: "WH/STOCK/SHELF2",
            type: LocationType.INTERNAL,
            parentId: stockLocation.id,
            warehouseId: warehouse.id,
            userId,
        },
    });

    // 3. Categories
    console.log("Seeding Categories...");
    const electronics = await prisma.category.upsert({
        where: { name_userId: { name: "Electronics", userId } },
        update: {},
        create: { name: "Electronics", userId },
    });

    const furniture = await prisma.category.upsert({
        where: { name_userId: { name: "Furniture", userId } },
        update: {},
        create: { name: "Furniture", userId },
    });

    // 4. Products
    console.log("Seeding Products...");
    const laptop = await prisma.product.upsert({
        where: { sku_userId: { sku: "ELEC-LAP-001", userId } },
        update: {},
        create: {
            name: "Laptop Pro X",
            sku: "ELEC-LAP-001",
            description: "High performance laptop for professionals",
            type: ProductType.STORABLE,
            costPrice: 800.00,
            salesPrice: 1200.00,
            categoryId: electronics.id,
            userId,
        },
    });

    const desk = await prisma.product.upsert({
        where: { sku_userId: { sku: "FURN-DESK-001", userId } },
        update: {},
        create: {
            name: "Office Desk",
            sku: "FURN-DESK-001",
            description: "Wooden desk with drawers",
            type: ProductType.STORABLE,
            costPrice: 150.00,
            salesPrice: 300.00,
            categoryId: furniture.id,
            userId,
        },
    });

    const chair = await prisma.product.upsert({
        where: { sku_userId: { sku: "FURN-CHAIR-001", userId } },
        update: {},
        create: {
            name: "Ergonomic Chair",
            sku: "FURN-CHAIR-001",
            description: "Comfortable office chair with lumbar support",
            type: ProductType.STORABLE,
            costPrice: 80.00,
            salesPrice: 200.00,
            categoryId: furniture.id,
            userId,
        },
    });

    const mouse = await prisma.product.upsert({
        where: { sku_userId: { sku: "ELEC-MOUSE-001", userId } },
        update: {},
        create: {
            name: "Wireless Mouse",
            sku: "ELEC-MOUSE-001",
            description: "Silent click wireless mouse",
            type: ProductType.STORABLE,
            costPrice: 15.00,
            salesPrice: 35.00,
            categoryId: electronics.id,
            userId,
        },
    });

    // 5. Contacts
    console.log("Seeding Contacts...");
    const vendor1 = await prisma.contact.upsert({
        where: { id: "seed-vendor-1" },
        update: {},
        create: {
            id: "seed-vendor-1",
            name: "Tech Supplies Inc",
            email: "vendor@tech.com",
            phone: "+1 555 0101",
            type: ContactType.VENDOR,
            address: "Silicon Valley, CA",
            userId,
        },
    });

    const vendor2 = await prisma.contact.upsert({
        where: { id: "seed-vendor-2" },
        update: {},
        create: {
            id: "seed-vendor-2",
            name: "WoodWorks Ltd",
            email: "sales@woodworks.com",
            phone: "+1 555 0102",
            type: ContactType.VENDOR,
            address: "Portland, OR",
            userId,
        },
    });

    const customer1 = await prisma.contact.upsert({
        where: { id: "seed-customer-1" },
        update: {},
        create: {
            id: "seed-customer-1",
            name: "Acme Corp",
            email: "procurement@acme.com",
            phone: "+1 555 0201",
            type: ContactType.CUSTOMER,
            address: "New York, NY",
            userId,
        },
    });

    // 6. Initial Stock (Inventory Adjustment)
    console.log("Seeding Initial Stock...");
    const openingStockRef = "WH/INV/0001";
    await prisma.stockTransfer.upsert({
        where: { reference_userId: { reference: openingStockRef, userId } },
        update: {},
        create: {
            reference: openingStockRef,
            type: TransferType.ADJUSTMENT,
            status: TransferStatus.DONE,
            sourceLocationId: adjustmentLocation.id,
            destinationLocationId: stockLocation.id,
            effectiveDate: new Date(),
            userId,
            stockMoves: {
                create: [
                    {
                        productId: laptop.id,
                        quantity: 10,
                        sourceLocationId: adjustmentLocation.id,
                        destinationLocationId: stockLocation.id,
                        status: TransferStatus.DONE,
                        userId,
                    },
                    {
                        productId: chair.id,
                        quantity: 20,
                        sourceLocationId: adjustmentLocation.id,
                        destinationLocationId: stockLocation.id,
                        status: TransferStatus.DONE,
                        userId,
                    },
                    {
                        productId: mouse.id,
                        quantity: 50,
                        sourceLocationId: adjustmentLocation.id,
                        destinationLocationId: shelf1.id,
                        status: TransferStatus.DONE,
                        userId,
                    },
                ],
            },
        },
    });

    // Update Stock Levels
    await prisma.stockLevel.upsert({
        where: {
            productId_locationId: { productId: laptop.id, locationId: stockLocation.id },
        },
        update: { quantity: 10 },
        create: {
            productId: laptop.id,
            locationId: stockLocation.id,
            quantity: 10,
            userId,
        },
    });

    await prisma.stockLevel.upsert({
        where: {
            productId_locationId: { productId: chair.id, locationId: stockLocation.id },
        },
        update: { quantity: 20 },
        create: {
            productId: chair.id,
            locationId: stockLocation.id,
            quantity: 20,
            userId,
        },
    });

    await prisma.stockLevel.upsert({
        where: {
            productId_locationId: { productId: mouse.id, locationId: shelf1.id },
        },
        update: { quantity: 50 },
        create: {
            productId: mouse.id,
            locationId: shelf1.id,
            quantity: 50,
            userId,
        },
    });

    // 7. Receipt (Incoming Shipment)
    console.log("Seeding Receipts...");
    const receiptRef = "WH/IN/00001";
    await prisma.stockTransfer.upsert({
        where: { reference_userId: { reference: receiptRef, userId } },
        update: {},
        create: {
            reference: receiptRef,
            type: TransferType.INCOMING,
            status: TransferStatus.DONE,
            contactId: vendor2.id,
            sourceLocationId: vendorLocation.id,
            destinationLocationId: stockLocation.id,
            scheduledDate: new Date(),
            effectiveDate: new Date(),
            userId,
            stockMoves: {
                create: [
                    {
                        productId: desk.id,
                        quantity: 5,
                        sourceLocationId: vendorLocation.id,
                        destinationLocationId: stockLocation.id,
                        status: TransferStatus.DONE,
                        userId,
                    },
                ],
            },
        },
    });

    // Update Stock Level for Receipt
    await prisma.stockLevel.upsert({
        where: {
            productId_locationId: { productId: desk.id, locationId: stockLocation.id },
        },
        update: { quantity: 5 },
        create: {
            productId: desk.id,
            locationId: stockLocation.id,
            quantity: 5,
            userId,
        },
    });

    // 8. Delivery Order (Pending)
    console.log("Seeding Deliveries...");
    const deliveryRef = "WH/OUT/00001";
    await prisma.stockTransfer.upsert({
        where: { reference_userId: { reference: deliveryRef, userId } },
        update: {},
        create: {
            reference: deliveryRef,
            type: TransferType.OUTGOING,
            status: TransferStatus.READY,
            contactId: customer1.id,
            sourceLocationId: stockLocation.id,
            destinationLocationId: customerLocation.id,
            scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
            userId,
            stockMoves: {
                create: [
                    {
                        productId: laptop.id,
                        quantity: 2,
                        sourceLocationId: stockLocation.id,
                        destinationLocationId: customerLocation.id,
                        status: TransferStatus.DRAFT,
                        userId,
                    },
                    {
                        productId: mouse.id,
                        quantity: 2,
                        sourceLocationId: shelf1.id,
                        destinationLocationId: customerLocation.id,
                        status: TransferStatus.DRAFT,
                        userId,
                    },
                ],
            },
        },
    });

    console.log("Seeding completed successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
