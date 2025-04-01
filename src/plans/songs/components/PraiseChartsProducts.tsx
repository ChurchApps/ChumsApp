import React, { useEffect } from "react";
import { ApiHelper, ArrayHelper, CurrencyHelper } from "@churchapps/apphelper";
import { Button, Grid, Icon, Table, TableBody, TableCell, TableRow } from "@mui/material";

interface Props {
  praiseChartsId: string;
}

export const PraiseChartsProducts = (props: Props) => {

  const [products, setProducts] = React.useState<any[]>([]);
  const [expandedSkus, setExpandedSkus] = React.useState<string[]>([]);

  const loadData = async () => {
    if (props.praiseChartsId) {
      const data = await ApiHelper.get("/songDetails/praiseCharts/raw/" + props.praiseChartsId, "ContentApi");
      const result = buildTree(data.products);
      setProducts(result);

    }
  }

  const addChildren = (product: any, allProducts: any[]) => {
    if (product.child_products) {
      product.children = [];
      product.child_products.forEach((child: any) => {
        const c = allProducts.find((p: any) => p.sku === child.sku);
        if (c) product.children.push(c);
        addChildren(c, allProducts);
      });
    }
  }

  const buildTree = (allProducts: any[]) => {
    const rootExcludedSkus: string[] = [];
    products.forEach((product: any) => {
      if (product.child_products) {
        product.child_products.forEach((child: any) => {
          rootExcludedSkus.push(child.sku);
        });
      }
    });

    console.log("Root Excluded Skus", rootExcludedSkus);

    const result: any[] = [];
    allProducts.forEach((product: any) => {
      if (!rootExcludedSkus.includes(product.sku)) {
        result.push(product);
      }
      if (product.child_products) {
        addChildren(product, allProducts);
      }
    });
    return result;

  }

  useEffect(() => { loadData() }, [props.praiseChartsId]) //eslint-disable-line react-hooks/exhaustive-deps

  const getPriceButton = (product: any) => {
    let result = <></>
    if (product.price) {
      if (product.price.price === 0) result = <Button variant="contained" size="small" color="primary"><Icon>download</Icon></Button>
      else result = <Button variant="contained" size="small" color="error">{CurrencyHelper.formatCurrency(product.price.price)}</Button>
    }
    return result;
  }

  const getProductRow = (product: any, indent: number) => {
    let a = 0;
    let expand = <></>;
    if (product.children?.length > 0) {
      if (expandedSkus.includes(product.sku)) expand = <a href="about:blank" onClick={(e) => { e.preventDefault(); setExpandedSkus(expandedSkus.filter(s => s !== product.sku)) }}>
        <Icon>expand_less</Icon>
      </a>
      else expand = <a href="about:blank" onClick={(e) => { e.preventDefault(); setExpandedSkus([...expandedSkus, product.sku]) }}>
        <Icon>expand_more</Icon>
      </a>
    }
    let result = <Grid container key={product.sku} style={{ marginBottom: 4 }}>
      <Grid item xs={1}>{expand}</Grid>
      <Grid item xs={4} style={{ paddingLeft: indent * 20 }}>{product.name}</Grid>
      <Grid item xs={1}>{product.file_type}</Grid>
      <Grid item xs={2}>{getPriceButton(product)}</Grid>
    </Grid>

    if (expandedSkus.includes(product.sku)) {
      const items = [result];
      product.children?.forEach((child: any) => {
        items.push(getProductRow(child, indent + 1) as JSX.Element);
      });
      return items;
    }

    return result;
  }

  return (<>
    {products.map((product: any) => getProductRow(product, 0))}
  </>)
}

