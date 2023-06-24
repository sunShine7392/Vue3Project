declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

interface Window {
  initBMap(): void;
}

declare const BMapGL: any;
