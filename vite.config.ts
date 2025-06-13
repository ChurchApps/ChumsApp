import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), ['PORT', "REACT_APP"]);
  console.log('Vite Environment Variables:', env);
  return {
    plugins: [react()],
    server: {
      port: Number(env.PORT) ?? 3101,
      strictPort: true,
      open: true,
    },    
    define: {
      // defining REACT_APP_ and NEXT_PUBLIC_ variables so we can phase REACT_APP_ out
      'process.env.REACT_APP_STAGE': JSON.stringify(env.REACT_APP_STAGE),
      'process.env.REACT_APP_ATTENDANCE_API': JSON.stringify(env.REACT_APP_ATTENDANCE_API),
      'process.env.REACT_APP_DOING_API': JSON.stringify(env.REACT_APP_DOING_API),
      'process.env.REACT_APP_GIVING_API': JSON.stringify(env.REACT_APP_GIVING_API),
      'process.env.REACT_APP_MEMBERSHIP_API': JSON.stringify(env.REACT_APP_MEMBERSHIP_API),
      'process.env.REACT_APP_REPORTING_API': JSON.stringify(env.REACT_APP_REPORTING_API),
      'process.env.REACT_APP_MESSAGING_API': JSON.stringify(env.REACT_APP_MESSAGING_API),
      'process.env.REACT_APP_MESSAGING_API_SOCKET': JSON.stringify(env.REACT_APP_MESSAGING_API_SOCKET),
      'process.env.REACT_APP_CONTENT_API': JSON.stringify(env.REACT_APP_CONTENT_API),
      'process.env.REACT_APP_GOOGLE_ANALYTICS': JSON.stringify(env.REACT_APP_GOOGLE_ANALYTICS),
      'process.env.REACT_APP_CONTENT_ROOT': JSON.stringify(env.REACT_APP_CONTENT_ROOT),
      'process.env.REACT_APP_B1_ROOT': JSON.stringify(env.REACT_APP_B1_ROOT),
      'process.env.REACT_APP_CHUMS_ROOT': JSON.stringify(env.REACT_APP_CHUMS_ROOT),
      'process.env.REACT_APP_LESSONS_ROOT': JSON.stringify(env.REACT_APP_LESSONS_ROOT),
      'process.env.NEXT_PUBLIC_STAGE': JSON.stringify(env.REACT_APP_STAGE),
      'process.env.NEXT_PUBLIC_ATTENDANCE_API': JSON.stringify(env.REACT_APP_ATTENDANCE_API),
      'process.env.NEXT_PUBLIC_DOING_API': JSON.stringify(env.REACT_APP_DOING_API),
      'process.env.NEXT_PUBLIC_GIVING_API': JSON.stringify(env.REACT_APP_GIVING_API),
      'process.env.NEXT_PUBLIC_MEMBERSHIP_API': JSON.stringify(env.REACT_APP_MEMBERSHIP_API),
      'process.env.NEXT_PUBLIC_REPORTING_API': JSON.stringify(env.REACT_APP_REPORTING_API),
      'process.env.NEXT_PUBLIC_MESSAGING_API': JSON.stringify(env.REACT_APP_MESSAGING_API),
      'process.env.NEXT_PUBLIC_MESSAGING_API_SOCKET': JSON.stringify(env.REACT_APP_MESSAGING_API_SOCKET),
      'process.env.NEXT_PUBLIC_CONTENT_API': JSON.stringify(env.REACT_APP_CONTENT_API),
      'process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS': JSON.stringify(env.REACT_APP_GOOGLE_ANALYTICS),
      'process.env.NEXT_PUBLIC_CONTENT_ROOT': JSON.stringify(env.REACT_APP_CONTENT_ROOT),
      'process.env.NEXT_PUBLIC_B1_ROOT': JSON.stringify(env.REACT_APP_B1_ROOT),
      'process.env.NEXT_PUBLIC_CHUMS_ROOT': JSON.stringify(env.REACT_APP_CHUMS_ROOT),
      'process.env.NEXT_PUBLIC_LESSONS_ROOT': JSON.stringify(env.REACT_APP_LESSONS_ROOT),
    },
  } satisfies UserConfig
})
