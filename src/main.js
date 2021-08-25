import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import vuexPersistedState from 'vuex-persistedstate'
import Router from 'vue-router'
import Visualiser from './components/Pages/VisualiserPage'
import Heatmap from './components/Pages/HeatmapPage'
import About from './components/Pages/AboutPage'
import Home from './components/Pages/HomePage'
import Clipboard from 'v-clipboard'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

Vue.config.productionTip = false

Vue.use(Clipboard)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      // Reroutes to login by default upon render
      path: '/',
      meta: {
        title: 'Acartia Visualiser',
        metaTags: [
          {
            name: 'Acartia Visualiser',
            content: 'An offline first example of using the Acartia decentralised data store'
          }
        ]
      },
      redirect: {
        name: 'Historical'
      }
    },
    {
      // Login page
      path: '/home',
      name: 'Home',
      meta: {
        title: 'Acartia Browser Vis',
        metaTags: [
          {
            name: 'SSEMMI Client',
            content: 'SSEMMI Client'
          }
        ]
      },
      component: Home
    },
    {
      // Register page to create new users - admin only
      path: '/about',
      name: 'About',
      component: About
    },
    {
      // Visualiser page to view data visualisations
      path: '/data-explorer',
      name: 'DataExplorer',
      component: Visualiser
    },
    {
      // Visualiser page to view data visualisations
      path: '/historical',
      name: 'Historical',
      component: Heatmap
    }
  ]
})


// Setup store with vuex
Vue.use(Vuex)
export const store = new Vuex.Store(
  {
    state: {
      isSyncing: false,
      sightings: []
    },
    mutations: {
      setSyncing(state, isSyncing) {
        state.isSyncing = isSyncing
      },
      setSightings(state, sightings) {
        state.sightings = sightings
      }
    },
    getters: {
      getSightings: state => {
        return state.sightings
      }
    },
    actions: {
      async get_ipfs_sightings({commit}) {
        try {
            // optional settings for the ipfs instance
            const ipfsOptions = {
              //repo: './ipfs',
              EXPERIMENTAL: { pubsub: true },
              preload: { enabled: true },
              config: {
                Bootstrap: [
                    process.env.VUE_APP_SWARM,
                    process.env.VUE_APP_SWARM
                ],
                Addresses: {
                  Swarm: [
                      process.env.VUE_APP_SWARM,
                      process.env.VUE_APP_SWARM,
                    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/libp2p-rdv.vps.revolunet.com/tcp/443/wss/p2p-webrtc-star/'
                  ]
                }
              }
            }
            commit('setSyncing', true)
            // Create IPFS instance with optional config
            const ipfs = await IPFS.create(ipfsOptions)

            // Create OrbitDB instance
            const orbitdb = await OrbitDB.createInstance(ipfs)
            console.log(orbitdb)

            // create database
            const db2 = await orbitdb.docs(process.env.VUE_APP_DB_ADDRESS)

            // Emit log message when db has synced with another peer
            db2.events.on('replicated', () => {
              const getData = db2.get('')
              // Set data from synchronisation into store
              commit('setSightings', getData)
            })

             /*db2.events.on('replicate.progress', (address, hash, entry, progress, have) => {
               console.log(`Sync is ${progress} complete`)
                 console.log(have, address, entry)

             } )*/

             // Emit a log message upon synchronisation with another peer
             db2.events.on('write', (address, entry) => {
              console.log(`
                ${address} Database to write. \n
                Entry: ${entry}.
              `)
            })

            // Emit a error message upon error handling if something happens during the creation of the IPFS node.
            db2.events.on('error', (error) => {
              console.log(`Database creation error: \n ${error}.`)
            })

            //Load locally persisted db state from memory
            await db2.load()

            console.info(`The location of the database is ${db2.address.toString()}`)

            // Log message upon successful db setup
            console.log("Database setup successful! \n")

        } catch (e) {
            console.log(e)
        }
      }
    },
    plugins: [vuexPersistedState({
      storage:window.sessionStorage
    })]
  }
)

new Vue({
  render: h => h(App),
  store: store,
  router: router,
  beforeEnter() { this.store.commit('init_store')}
}).$mount('#app')
