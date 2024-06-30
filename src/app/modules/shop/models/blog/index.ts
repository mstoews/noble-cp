
export interface BlogImages {
  image: string;
  thumbImage: string;
  alt: string;
  title: string;

}

export interface Blog {
  id:                string;
  title:             string;
  paragraph?:        string;
  body?:             string;
  conclusion?:       string;
  user_updated?:     string;
  date_created:      string;
  date_updated?:     string;
  image?:            string;
  published:         boolean;
  tailoring?:        boolean;
  calendar?:         boolean;
}

export interface BlogPartial {
  id: string;
  title:   string;
  date_created: string;
  published: boolean;
}

export interface Comments {
  id: string;
  blog_id: string;
  name: string;
  message: string;
  created_date: string;
  reply: string;
  reply_date: string
}




