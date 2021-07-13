<template>
  <div>
    <div id="navbar-top">
      <mdb-navbar color="black" dark>
        <mdb-navbar-brand router to="/home">
          Acartia.io Example
        </mdb-navbar-brand>
        <mdb-navbar-toggler>
          <mdb-navbar-nav right>
            <mdb-nav-item router to="/about" >About</mdb-nav-item>
            <mdb-nav-item router to="/data-explorer" >Recent Sightings</mdb-nav-item>
            <mdb-nav-item router to="/historical">Historical Sightings</mdb-nav-item>
          </mdb-navbar-nav>
        </mdb-navbar-toggler>
      </mdb-navbar>
    </div>
    <div id="app">
      <!-- Adding dependency for mapbox css for map visualisation -->
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem } from 'mdbvue';

export default {
  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbNavItem
  }
}
</script>

<style>
#app {
  color: #2c3e50;
  /* margin-top: 60px; */
  text-align: center;
  clear: both;
}

#title {
  text-align: left;
  font-weight: bold;
  display: inline;
  /* position: relative;
  left: -50px; */
  float: left;
}

#navbar-top li {
  /* Adding space between each navbar items. "li" is used as mdb-nav-item will be compiled into list components */
  padding-right: 10px;
  padding-left: 10px;
}

#dropdown-manage .dropdown-menu {
  left: -50;
}

</style>
