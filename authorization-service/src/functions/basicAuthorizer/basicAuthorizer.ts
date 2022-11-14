const generatePolicy = (principalId: string, Resource: string, Effect: string) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: {
            Action: 'execute-api:Invoke',
            Effect,
            Resource,
        },
    },
});

export const basicAuthorizerHandler = async (event, _context, cb) => {
    console.log('event', event);
    if (event.type !== 'TOKEN') {
        cb('Unauthorized');
    }
    try {
        const { authorizationToken } = event;
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const [username, password] = plainCreds;
        console.log('username', username);
        console.log('password', password);
        const storedUserPassword = process.env[username];
        console.log('storedUserPassword', storedUserPassword);
        const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';
        console.log('effect', effect);
        const policy = generatePolicy(encodedCreds, event.methodArn, effect);
        console.log('policy', policy);

        cb(null, policy);
    }
    catch ( err ) {
        cb(`Unauthorized: ${err?.message}`);
    }
}