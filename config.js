let host = window.location.host;
let api_domain = "http://59.110.175.92:8084";


if(host.indexOf("daily.wings90.com") != -1){
  api_domain = "http://daily.wings90.com/apis";
}

if(host.indexOf("a.daily.wings90.com") != -1){
  api_domain = "http://a.daily.wings90.com:8030/apis";
}

if(host.indexOf("www.shixionglaile.com") != -1){
  api_domain = "http://www.shixionglaile.com:8030/apis";
}

// api_domain = "http://192.168.0.107:8084";//菊
// api_domain = "http://192.168.0.119:8084";//胖子
// api_domain = "http://web.shixionglaile.com:8084";//师兄来了服务器

let config = {
  api_domain: api_domain,
  static_domain: "http://114.55.248.123"
}
export default config;