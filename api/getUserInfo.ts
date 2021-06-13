import axios from "axios";

export interface GetUserInfoResData {
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

export interface GetUserInfoRes {
  code: number;
  message: string;
  ttl: number;
  data: GetUserInfoResData;
}

const getUserInfo = async (mid: number | string): Promise<GetUserInfoRes> => {
  const res = await axios.get(
    `http://api.bilibili.com/x/web-interface/card?mid=${mid}`
  );
  return res.data;
};
export default getUserInfo;
