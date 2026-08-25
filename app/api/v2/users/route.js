
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { randomBytes } from "crypto";
import { mailOptions, transporter } from "@/app/(pages)/auth/email";
import { Auth } from "../../utils/oldAuth.js";
import {auth} from "@/app/api/utils/auth.ts";
import {headers} from "next/headers";


export async function GET(req) {

  const session = await auth.api.getSession({headers: await headers()});
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)

  const params = req.nextUrl.searchParams

  const queryParams = {}
  if (params.get("active") === "true") {
    queryParams.update({where: {active: true}})
  }
  const res = await prisma.user.findMany(queryParams)
  return authCheck.verify(NextResponse.json(
    {users: res},
    {status: 200}
  ));
}