declare module "bili-api" {
  export default function biliAPI(
    input: { bvid?: string; aid?: string | number; mid?: string | number },
    require: string[]
  ): Promise<any>;
}
