import { Role } from 'src/user/schema/user.schema';

export interface JwtPayloadInterface {
  id: string;
  name: string;
  role: Role;
}
