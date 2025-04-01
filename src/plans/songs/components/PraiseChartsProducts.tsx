import React, { useEffect } from "react";
import { ApiHelper, ArrayHelper, CurrencyHelper } from "@churchapps/apphelper";
import { Button, Icon, Table, TableBody, TableCell, TableRow } from "@mui/material";

interface Props {
  praiseChartsId: string;
}

export const PraiseChartsProducts = (props: Props) => {

  const [products, setProducts] = React.useState<any[]>([]);
  const [expandedSku, setExpandedSku] = React.useState<string>("");

  const loadData = async () => {
    if (props.praiseChartsId) {
      const data = await ApiHelper.get("/songDetails/praiseCharts/raw/" + props.praiseChartsId, "ContentApi");
      const result = buildTree(data.products);
      setProducts(result);

    }
  }

  const findRecursive = (productTree: any[], product: any) => {
    let result = productTree.find((p: any) => p.sku === product.sku);
    if (!result) {
      productTree.forEach((p: any) => {
        if (p.children) {
          result = findRecursive(p.children, product);
        }
      });
    }
    return result;
  }

  const addChildren = (product: any, products: any[]) => {
    if (product.child_products) {
      product.children = [];
      product.child_products.forEach((child: any) => {
        const c = products.find((p: any) => p.sku === child.sku);
        if (c) product.children.push(c);
        addChildren(c, products);
      });
    }
  }

  const buildTree = (products: any[]) => {
    const result: any[] = [];
    products.forEach((product: any) => {
      let found = findRecursive(result, product);
      if (!found) {
        result.push(product);
        addChildren(product, products);
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
    let result = <TableRow key={product.sku}>
      <TableCell style={{ paddingLeft: indent * 20 }}><a href="about:blank" onClick={(e) => { e.preventDefault(); setExpandedSku(product.sku) }}>{product.children?.length > 0 && "C"}</a></TableCell>
      <TableCell style={{ paddingLeft: indent * 20 }}>{product.name}</TableCell>
      <TableCell>{product.file_type}</TableCell>
      <TableCell>{getPriceButton(product)}</TableCell>
    </TableRow>

    if (product.sku === expandedSku) {
      const items = [result];
      product.children?.forEach((child: any) => {
        items.push(getProductRow(child, indent + 1) as JSX.Element);
      });
      return items;
    }

    return result;
  }

  return (
    <Table>
      <TableBody>
        {products.map((product: any) => getProductRow(product, 0))}
      </TableBody>

    </Table>)
}

