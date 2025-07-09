

export class MaxNumberCheckinsError extends Error{
    constructor(){
        super('Max number of checkins reached');
    }
}