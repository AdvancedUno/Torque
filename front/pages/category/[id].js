import Header from "@/components/Header";
import Title from "@/components/Title";
import Center from "@/components/Center";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import styled from "styled-components";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1{
    font-size:1.5em;
  }
`;
const FiltersWrapper = styled.div`
  display: flex;
  gap: 15px;
`;
const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  color:#444;
  select{
    background-color:transparent;
    border:0;
    font-size:inherit;
    color:#444;
  }
`;

export default function CategoryPage({
  category,subCategories,products:originalProducts
}) {
  const defaultSorting = '_id-desc';
  const defaultFilterValues = category.properties
    .map(p => ({name:p.name,value:'all'}));
  const [products,setProducts] = useState(originalProducts);
  const [filtersValues,setFiltersValues] = useState(defaultFilterValues);
  const [sort,setSort] = useState(defaultSorting);
  const [loadingProducts,setLoadingProducts] = useState(false);
  const [filtersChanged,setFiltersChanged] = useState(false);

  function handleFilterChange(filterName, filterValue) {
    setFiltersValues(prev => {
      return prev.map(p => ({
        name:p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  }
  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProducts(true);
    const catIds = [category._id, ...(subCategories?.map(c => c._id) || [])];
    const params = new URLSearchParams;
    params.set('categories', catIds.join(','));
    params.set('sort', sort);
    filtersValues.forEach(f => {
      if (f.value !== 'all') {
        params.set(f.name, f.value);
      }
    });
    const url = `/api/products?` + params.toString();
    axios.get(url).then(res => {
      setProducts(res.data);
      setLoadingProducts(false);
    })
  }, [filtersValues, sort, filtersChanged]);
  return (
    <>
      <Header />
      <Center>
        <CategoryHeader>
          <h1>{category.name}</h1>
          <FiltersWrapper>
            {category.properties.map(prop => (
              <Filter key={prop.name}>
                <span>{prop.name}:</span>
                <select
                  onChange={ev => handleFilterChange(prop.name, ev.target.value)}
                  value={filtersValues.find(f => f.name === prop.name).value}>
                  <option value="all">All</option>
                  {prop.values.map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </Filter>
            ))}
            <Filter>
              <span>Sort:</span>
              <select
                value={sort}
                onChange={ev => {
                  setSort(ev.target.value);
                  setFiltersChanged(true);
                }}>
                <option value="price-asc">price, lowest first</option>
                <option value="price-desc">price, highest first</option>
                <option value="_id-desc">newest first</option>
                <option value="_id-asc">oldest first</option>
              </select>
            </Filter>
          </FiltersWrapper>
        </CategoryHeader>
        {loadingProducts && (
          <Spinner fullWidth />
        )}
        {!loadingProducts && (
          <div>
            {products.length > 0 && (
              <ProductsGrid products={products} />
            )}
            {products.length === 0 && (
              <div>Sorry, no products found</div>
            )}
          </div>
        )}
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({parent:category._id});
  const catIds = [category._id, ...subCategories.map(c => c._id)];
  const products = await Product.find({category:catIds});
  return {
    props:{
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
    }
  };
}