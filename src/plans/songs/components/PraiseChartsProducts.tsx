import React, { useEffect } from "react";
import { ApiHelper, ArrayHelper, CurrencyHelper, Locale } from "@churchapps/apphelper";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { PraiseChartsHelper } from "../../../helpers/PraiseChartsHelper";
import { Link } from "react-router-dom";

interface Props {
  praiseChartsId: string;
  keySignature: string;
  onHide: () => void;
}

export const PraiseChartsProducts = (props: Props) => {

  const [products, setProducts] = React.useState<any[]>([]);
  const [expandedSkus, setExpandedSkus] = React.useState<string[]>([]);
  const [hasAccount, setHasAccount] = React.useState<boolean>(true);

  const loadData = async () => {
    if (props.praiseChartsId) {
      let url = "/songDetails/praiseCharts/products/" + props.praiseChartsId
      if (props.keySignature) url += "?keys=" + props.keySignature;
      const data = await ApiHelper.get(url, "ContentApi");
      const tree = buildTree(data);

      if (data.length === 0) {
        const { hasAccount } = await ApiHelper.get("/songDetails/praiseCharts/hasAccount", "ContentApi");
        setHasAccount(hasAccount);
      }

      setProducts(tree);
    }
  }

  const addChildren = (product: any, allProducts: any[]) => {
    if (product?.child_products) {
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

  useEffect(() => { loadData() }, [props.praiseChartsId, props.keySignature]) //eslint-disable-line react-hooks/exhaustive-deps

  const download = async (product: any) => {
    PraiseChartsHelper.download(product.sku, product.file_name, "");
  }

  const purchase = async (sku: string) => {
    const returnUrl = window.location.origin + "/pingback"
    const purchaseUrl = `https://www.praisecharts.com/buynow?sku=${sku}&return_url=${encodeURIComponent(returnUrl)}`;
    const popup = window.open(purchaseUrl, 'oauth', 'width=600,height=700');

    window.addEventListener('message', async (event) => {
      if (event.origin !== window.location.origin) return;
      popup.close();
      loadData();
    });
  };


  const getPriceButton = (product: any) => {
    let result = <></>
    if (product.price) {
      if (product.permissions?.can_download) result = <Button variant="contained" size="small" color="primary" onClick={(e) => { e.preventDefault(); download(product); }}><Icon>download</Icon></Button>
      else if (product.price.price === 0) result = <Button variant="contained" size="small" color="success" onClick={(e) => { e.preventDefault(); purchase(product.sku); }}>Free</Button>
      else result = <Button variant="contained" size="small" color="error" onClick={(e) => { e.preventDefault(); purchase(product.sku); }}>{CurrencyHelper.formatCurrency(product.price.price)}</Button>
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
    let result = <Grid container spacing={1} key={product.sku} style={{ marginBottom: 4 }}>
      <Grid item xs={1}>{expand}</Grid>
      <Grid item xs={4} style={{ paddingLeft: indent * 20 }}>{product.name}</Grid>
      <Grid item xs={1}>{product.file_type}</Grid>
      <Grid item xs={2}>{product.sku}</Grid>
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

  return (<Dialog open={true} fullWidth={true} maxWidth="lg">
    <DialogTitle>Add Products from PraiseCharts</DialogTitle>
    <DialogContent>
      {products.map((product: any) => getProductRow(product, 0))}
      {!hasAccount && <p>You do not have a linked PraiseCharts account.  Go to your <Link to="/profile">profile</Link> to link an account. </p>}
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onHide} data-cy="cancel-merge">Close</Button>
    </DialogActions>
  </Dialog>)
}

