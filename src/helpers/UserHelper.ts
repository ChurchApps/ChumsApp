import { UserHelper as BaseUserHelper } from "../appBase/helpers"
import { PersonInterface } from "./Interfaces";

export class UserHelper extends BaseUserHelper {
    static person: PersonInterface;
}