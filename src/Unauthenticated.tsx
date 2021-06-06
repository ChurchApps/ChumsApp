import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Login } from "./Login"
import { Forgot } from "./Forgot"

export const Unauthenticated = () => (
  <>
    <Switch>
      <Route path="/login" component={Login}></Route>
      <Route path="/forgot"><Forgot /></Route>
      <Route path="/"><Redirect to="/login" /></Route>
    </Switch>
  </>
)
