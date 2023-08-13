"use strict";
import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

export let baseUrl = "https://admin.hiperfumeusa.com/api/v1/";

@Injectable()
export class GetTokenNow {
  subscribtion: any;
  token = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNWU4NjRkYmQ5NDdiNzUwMWIwOWZkN2JiMjFmMjgyN2Y4MjhhYzVjOGYzOWFlYWE4OWNjZTY5NWFjNjA2NjBkMzNiNTM3MzExMWQyNTQ4ZWIiLCJpYXQiOjE2ODkxNzcxMDEuOTU4Mzk3LCJuYmYiOjE2ODkxNzcxMDEuOTU4Mzk5LCJleHAiOjE3MjA3OTk1MDEuOTQ0MTgzLCJzdWIiOiI2Iiwic2NvcGVzIjpbXX0.xUZhgQUTX4-GKtFtpG1h_QxsjpoIv0DUMpKIzANxaf26yoYrJWmv2SU9PjHATbdGkfTdwtwE2jRg1HT1LgF_mQKde0awCTbswzf06eGd4LB9sb32KxeQinLhxY1AhvoLrp0wQ8_Nq9fcDTsKVHOPSMPl5Sng7jLJc6XiTHnPoShY4nIu9gGyTPBZkg1vnzAxJqq8OeCMKZP7Vq7C2lFQ1lc-JVJ7DalsXv4zt19A16tZJuj9tGqfEkrKQsxGs200g8zOrwSGtRFKDp_n__LlsbZpx9gAnkHIq8hX7e9nie6g82hm7kMrSNlB8vhx2TH_VJXiRXCoDVXrMnSqdP9L23OD62ylxpD9DZ4SGF_rN0Licr1w_hUZ5CRc9GPz-Hh0vsgqFapcjDO8D3wQWV0yjkbAgRX-4gGVf73n3A3pWe6s00LTR4fhsKb32VQj56_oFTK5pT0useFCMLoKVqAaLStXl5H_0UNQHDB-dbilvhhNe47JMwAXrZMtWfav1iqUxNgRnKRbBAU7svdgs6boIjQshapVV2EmoMHxTgcav6H1OdvtE42G2H3n_znptmujovphnlWMVaBDz9iLrfaKSj8qfb4301pQdIC1NO-6mZzitqpB9QV6WyveaqzjmXPDeshlODFLwySgcGcOxpv3941n1f1lupT1I2DXCXFTXdM`;

  constructor() {}
  headers() {
    let headersNow: HttpHeaders = new HttpHeaders();
    headersNow = headersNow.append("Content-Type", "application/json");
    headersNow = headersNow.append("Authorization", this.token);
    headersNow = headersNow.append("params", "");
    return { headers: headersNow };
  }
  headerProfile(access_token ) {
    let headersNow: HttpHeaders = new HttpHeaders();
    headersNow = headersNow.append("Content-Type", "application/json");
    headersNow = headersNow.append("Authorization",  access_token  || '');
    headersNow = headersNow.append("params", "");
    return { headers: headersNow };
  }
  headerPost(access_token) {
    let headersNow: HttpHeaders = new HttpHeaders();
    headersNow = headersNow.append("Content-Type", "application/json");
    headersNow = headersNow.append("Authorization",  access_token);
    headersNow = headersNow.append("params", "");
    return { headers: headersNow };
  }
  headerGet() {
    let headersNow: HttpHeaders = new HttpHeaders();
    headersNow = headersNow.append("Content-Type", "application/json");
    // headersNow = headersNow.append("Authorization", this.token);
    // headersNow = headersNow.append("params", "");
    return { headers: headersNow };
  }
  formDataHeaders() {
    let headersNow: HttpHeaders = new HttpHeaders();
    headersNow = headersNow.append("Content-Type", "multipart/form-data");
    headersNow = headersNow.append("Authorization", this.token);
    headersNow = headersNow.append("params", "");
    return { headers: headersNow };
  }
}
