
export class LateCheckinValidationError extends Error{
    constructor(){
        super('The checkin can only be validated 20 minutes after your creation')
    }   
};