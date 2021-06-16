import axios from "axios";

interface QuerySpaceRes {
  code: number;
  message: string;
  ttl: number;
  data: QuerySpaceResData;
}

export interface QuerySpaceResData {
  list: {
    tlist: Record<string, { tid: number; count: number; name: string }>;
    vlist: VlistType[];
  };
  page: {
    pn: number;
    ps: number;
    count: number;
  };
  episodic_button: {
    text: string;
    uri: string;
  };
}

export interface VlistType {
  comment: number;
  typeid: number;
  play: number;
  pic: string;
  subtitle: string;
  description: string;
  copyright: string;
  title: string;
  review: number;
  author: string;
  mid: number;
  created: number;
  length: string;
  video_review: number;
  aid: number;
  bvid: string;
  hide_click: boolean;
  is_pay: number;
  is_union_video: number;
  is_steins_gate: number;
  is_live_playback: number;
}

const getUserSpace = async (
  mid: number | string,
  pn = 1,
  ps = 30
): Promise<QuerySpaceResData> => {
  const { data }: { data: QuerySpaceRes } = await axios.get(
    `https://api.bilibili.com/x/space/arc/search?mid=${mid}&pn=${pn}&ps=${ps}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
      },
    }
  );
  return data.data;
};

export default getUserSpace;
