<template>
  <div id="app">
    <header class="navbar">
      <div class="container">
        <nav>
          <h1>⛅ Weather Analytics</h1>
          <ul class="nav-links">
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/analytics">Analytics</router-link></li>
            <li><router-link to="/maps">Maps</router-link></li>
          </ul>
        </nav>
      </div>
    </header>
    
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
