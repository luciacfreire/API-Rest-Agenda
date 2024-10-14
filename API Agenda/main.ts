type User = [
  name : string,
  email: string
];

let users = [
  {
    name: "Alberto", email: "aaa@gmail.com"
  },
{
  name: "Luis", email: "lll@gmail.com",
}
 
];

const handler = async (req:Request) : Promise <Response> => {
  
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;



  if(method === "GET"){
    
    if(path === "/users"){
      
      const name = url.searchParams.get("name");
      if(name){
        return new Response(
          JSON.stringify(users.filter((u) => u.name === name)),
        );
      }
      return new Response(JSON.stringify(users));
    
    } else if ( path === "/user"){
      
      const email = url.searchParams.get("email");
      if(!email){
        return new Response("Bad request", {status: 400});
      }
      const foundUser = users.find(u=>u.email === email);
      if(!foundUser) return new Response("Not found", {status: 400});
      return new Response(JSON.stringify(foundUser));
    }
  }
  
  else if (method === "POST"){
    if(path === "/users"){
      
      if(!req.body) return new Response("Bad request", {status:400});
      
      const payload = await req.json();
      
      if(!payload.name || !payload.email){
        return new Response("Bad request", {status:400})
      }
      if(users.some((u)=> u.email === payload.email)) {
        return new Response("Duplicated", {status : 409});
      }

      users.push({
        name : payload.name,
        email : payload.email,
      });

      return new Response(JSON.stringify(payload));
    }
  }

  else if(method === "PUT"){
    if(path === "/users"){
      
      if(!req.body) return new Response("Bad request", {status:400});
      
      const payload = await req.json();
      
      if(!payload.name || !payload.email){
        return new Response("Bad request", {status:400})
      }

      const userFound = users.find((u) => u.email === payload.email);
      if(!userFound) return new Response("Not found", {status: 404});
      userFound.name = payload.name;

      return new Response(JSON.stringify(payload));
    }
  }

  else if(method === "DELETE"){

    if(path === "/users"){
      
      if(!req.body) return new Response("Bad request", {status:400});
      
      const payload = await req.json();
      
      if(!payload.email){
        return new Response("Bad request", {status:400})
      }
      
      users = users.filter(u=> u.email !== payload.email);

      return new Response("Deleted");
    }
  }

  return new Response("Endpoint not found", { status: 404 } );
};

Deno.serve({port:3000},handler);
