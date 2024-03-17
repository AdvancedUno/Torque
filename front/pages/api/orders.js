import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Order} from "@/models/Order";

export default async function handle(req, res) {
  await mongooseConnect();
  const {user} = await getServerSession(req, res, authOptions);
  res.json(
    await Order.find({userEmail:user.email})
  );
}