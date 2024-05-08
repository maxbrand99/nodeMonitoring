
const { Client } = require('pg')
async function dbCheck() {
    try {
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'bridge',
            password: 'postgres',
            port: 5432,
        })

        await client.connect()

        const res = await client.query('select count(*) from task where status=\'failed\'');

        let row = res.rows[0];
        if (row.fail > 100) {
            console.log(`AxieChat Node Database has ${row.fail} failures: ` + new Date());
        } else {
            console.log(`AxieChat Node Database status ${JSON.stringify(row, null, 2)}`);
        }

        await client.end()
    } catch (ex) {
        notifyOnCall(`AxieChat Node Database has failed to work on db: ` + new Date());
        console.log(ex);
    }
}

dbCheck();
