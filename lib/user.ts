import fetch from 'node-fetch';
import { IncomingMessage, ServerResponse } from 'http';
import { apiUrl } from './config';

export interface AnonymousUser {
  id: string;
}

export interface LoggedUser {
  id: string;
  name: string;
  email: string;
  image: string;
  infoConfirmed: boolean;
  premium: boolean;
  providers: string[];
}

interface UserResponse {
  user: AnonymousUser | LoggedUser;
  isLoggedIn: boolean;
}

interface GetUserParams {
  req: IncomingMessage;
  res: ServerResponse;
}

export async function getUser({
  req,
  res,
}: GetUserParams): Promise<UserResponse> {
  const userRes = await fetch(`${apiUrl}/v1/users/me`, {
    headers: req ? { cookie: req.headers.cookie } : undefined,
  });
  const body = await userRes.json();

  if (userRes.headers.get('set-cookie')) {
    res.setHeader('set-cookie', userRes.headers.get('set-cookie'));
  }

  return {
    user: body,
    isLoggedIn: !!body.providers,
  };
}
