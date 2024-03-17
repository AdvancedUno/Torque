import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";

export default function ProductsPage({products,wishedProducts}) {
  return (
    <>
      <Header />
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} wishedProducts={wishedProducts} />
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, {sort:{'_id':-1}});
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user
      ? await WishedProduct.find({
          userEmail:session?.user.email,
          product: products.map(p => p._id.toString()),
        })
      : [];
  return {
    props:{
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map(i => i.product.toString()),
    }
  };
}