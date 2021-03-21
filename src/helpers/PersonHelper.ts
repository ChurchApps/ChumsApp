import { PersonInterface, ContactInfoInterface } from './Interfaces';
import { EnvironmentHelper } from '../components';

export class PersonHelper {
    static getPhotoUrl(person: PersonInterface) {
        console.log(EnvironmentHelper.ContentRoot)
        console.log(person?.photo);
        return person?.photo ? EnvironmentHelper.ContentRoot + person?.photo : '/images/sample-profile.png';
    }

    static getAge(birthdate: Date): string {
        if (birthdate !== undefined && birthdate !== null) {
            var ageDifMs = Date.now() - new Date(birthdate).getTime();
            var ageDate = new Date(ageDifMs);
            var years = Math.abs(ageDate.getUTCFullYear() - 1970);
            return years + " years";
        }
        else return "";
    }

    static getDisplayName(firstName: string, lastName: string, nickName: string): string {
        if (nickName !== undefined && nickName !== null && nickName.length > 0) return firstName + ' "' + nickName + '" ' + lastName;
        else return firstName + ' ' + lastName;
    }

    public static compareAddress(address1: ContactInfoInterface, address2: ContactInfoInterface): boolean {
        const displayAddress1: string = this.addressToString(address1).trim();
        const displayAddress2: string = this.addressToString(address2).trim();

        if (displayAddress1 !== displayAddress2) {
            return true
        }
        return false
    }

    public static addressToString(address: ContactInfoInterface): string {
        return `${address.address1 || ''} ${address.address2 || ''} ${address.city || ''}${(address.city && address.state) ? ',' : ''} ${address.state || ''} ${address.zip || ''}`
    }

    public static changeOnlyAddress(contactInfo1: ContactInfoInterface, contactInfo2: ContactInfoInterface): ContactInfoInterface {
        const updatedAddress: ContactInfoInterface = {
            ...contactInfo1,
            address1: contactInfo2.address1,
            address2: contactInfo2.address2,
            city: contactInfo2.city,
            state: contactInfo2.state,
            zip: contactInfo2.zip
        }

        return updatedAddress
    }

    public static checkAddressAvailabilty(person: PersonInterface): boolean {
        const addressString: string = this.addressToString(person.contactInfo).trim();
        if (addressString !== '') {
            return true;
        }
        return false;
    }
}
