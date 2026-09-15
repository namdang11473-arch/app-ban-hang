import { NextResponse } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.findUnique({ where: { id: body.productId } });
    if (!product) return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });

    const total = product.price * (body.quantity || 1);
    const commission = Math.round((total * product.affiliateRewardPercent) / 100);

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerAddress: body.customerAddress,
        variant: body.variant,
        quantity: body.quantity || 1,
        totalAmount: Math.round(total),
        commissionAmount: body.affiliateId ? commission : 0,
        productId: product.id,
        affiliateId: body.affiliateId || null,
        status: "PENDING",
        paymentMethod: body.paymentMethod || "COD"
      }
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
