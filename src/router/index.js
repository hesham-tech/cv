import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';

// Create the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: (routes) => {
    const layouts = setupLayouts(routes);
    layouts.push({
      path: '/:lang/:id/:section*',
      name: 'cv-page-manual',
      component: () => import('@/components/CVPage.vue'),
      meta: { layout: 'pure' },
    });
    return layouts;
  },
});

// Fetch track names and add them in meta
console.log('DEBUG: Generated Routes:', router.getRoutes());
router.getRoutes().forEach(route => {
  // console.log('path', route.path);

  const lastSegment = route.path.substring(route.path.lastIndexOf('/') + 1);

  // Convert the first letter to a capital letter
  const capitalizedSegment = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  // Return the correct links
  if (capitalizedSegment && /^[a-zA-Z]/.test(capitalizedSegment)) {
    // route.meta.title = capitalizedSegment;
    if (
      route.name != undefined &&
      capitalizedSegment != 'Login' &&
      capitalizedSegment != 'Register' &&
      capitalizedSegment != 'NotAuth' &&
      capitalizedSegment != 'Found'
    ) {
      route.name = lastSegment;
      route.meta.roles = ['add', 'update', 'delete'];
      // console.log('title', route.meta.title);
      // console.log('show', route.meta.show);
      // console.log('name', route.name);
      // const Permissions = localStorage.user ? JSON.parse(localStorage.user).role : [];
      // Permissions.includes(capitalizedSegment.toLowerCase()) &&
      if (
        route.name != 'user' &&
        route.name != 'admin' &&
        route.name != 'contact' &&
        // route.name != 'project' &&
        route.name != 'credentials' &&
        route.name != 'language'
      ) {
        route.meta.show = true;
      }
    }
  }
});

// console.log(router.getRoutes());
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Portfolio';
  const token = localStorage.getItem('token');
  if (!to.params.lang) {
    if (to.params) {
      if (token) {
        if (to.path === '/login' || to.path === '/register' || to.path === '/') {
          next({ path: 'admin/' });
        } else {
          next();
        }
      } else {
        if (to.path === '/login' || to.path === '/register') {
          next();
        } else {
          if (to.path !== '/') {
            next({ path: '/' }); // توجيه المستخدم إلى /
          } else {
            next(); // متابعة التوجيه إذا كان المستخدم بالفعل في /
          }
        }
      }
    } else {
      next({ path: '/found' });
    }
  } else {
    if (to.params.lang === 'ar' || to.params.lang === 'en') {
      next();
    } else {
      next({ path: '/found' });
    }
  }
});

export default router;
