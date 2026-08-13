import type { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>ATARI</ShortName>
  <Description>Recherche de personnes EPFL sur ATARI</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image height="16" width="16" type="image/x-icon">${origin}/favicon.ico</Image>
  <Url type="text/html" method="get" template="${origin}/?search={searchTerms}"/>
</OpenSearchDescription>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/opensearchdescription+xml; charset=UTF-8" },
  });
}
