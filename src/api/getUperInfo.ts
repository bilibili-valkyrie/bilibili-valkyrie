import axios from "axios";
import InvalidMidError from "../errors/InvalidMidError";

export interface GetUperInfoResData {
  card: {
    mid: string;
    name: string;
    approve: boolean;
    sex: string;
    rank: string;
    face: string;
    DisplayRank: string;
    regtime: number;
    spacesta: number;
    birthday: string;
    place: string;
    description: string;
    article: number;
    attentions: unknown[];
    fans: number;
    friend: number;
    attention: number;
    sign: string;
    level_info: {
      current_level: number;
      current_min: number;
      current_exp: number;
      next_exp: number;
    };
    pendant: {
      pid: number;
      name: string;
      image: string;
      expire: number;
      image_enhance: string;
      image_enhance_frame: string;
    };
    nameplate: {
      nid: number;
      name: string;
      image: string;
      image_small: string;
      level: string;
      condition: string;
    };
    Official: {
      role: number;
      title: string;
      desc: string;
      type: number;
    };
    official_verify: {
      type: number;
      desc: string;
    };
    vip: {
      type: number;
      status: number;
      due_date: number;
      vip_pay_type: number;
      theme_type: number;
      label: {
        path: string;
        text: string;
        label_theme: string;
        text_color: string;
        bg_style: number;
        bg_color: string;
        border_color: string;
      };
      avatar_subscript: number;
      nickname_color: string;
      role: number;
      avatar_subscript_url: string;
      vipType: number;
      vipStatus: number;
    };
  };
  following: boolean;
  archive_count: number;
  article_count: number;
  follower: number;
}

export interface GetUperInfoRes {
  code: number;
  message: string;
  ttl: number;
  data: GetUperInfoResData;
}

const getUperInfo = async (mid: number | string): Promise<GetUperInfoRes> => {
  const res = await axios.get(
    `http://api.bilibili.com/x/web-interface/card?mid=${mid}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
      },
    }
  );
  if (res.data.code !== 0)
    throw new InvalidMidError({ message: `${mid} is not valid.` });
  return res.data;
};
export default getUperInfo;
