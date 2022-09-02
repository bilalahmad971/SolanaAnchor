use anchor_lang::prelude::*;

declare_id!("4uyEyWgfZBEB64w5szdvARAxeAqofbWWWXzqsz7io7aN");

#[program]
pub mod helloworld {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()>
    {
        Ok(())
    }
    pub fn create(ctx: Context<Create>) -> Result<()>
    {
        Ok(())
    }

    //Every time we call insert will overwrite the previous record...
    pub fn insert(ctx: Context<Insert>, data: Record) -> Result<()>
    {
        // Deserializing Account...
        // let record_account = &mut ctx.accounts.record;
        ctx.accounts.record.name = data.name;
        ctx.accounts.record.id = data.id;
        ctx.accounts.record.student = data.student;
        Ok(())
    }
}

#[derive(Accounts)]
#[account(Default)]
pub struct Initialize
{}

// instruction to creation of record Account...
#[derive(Accounts)]
pub struct Create<'info>
{
    #[account(init, payer = user, space = 8 + 40)]
    pub record : Account<'info, Record>,
    #[account(mut)]
    pub user : Signer<'info>,
    pub system_program : Program <'info, System>
}

// instruction for inserting record in already initialized account...
#[derive(Accounts)]
pub struct Insert<'info>
{
    #[account(mut)]
    pub record: Account<'info, Record>
}

#[account]
pub struct Record
{
    pub id : u64,
    pub name: String,
    pub student: bool,
}
