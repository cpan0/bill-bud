const { SlashCommandBuilder } = require('discord.js');
const { createWorker } = require('tesseract.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('read')
        .setDescription('Read and extract uploaded reciept.')
        .addAttachmentOption(option => 
            option.setName('image')
                .setDescription('The reciept to be read.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.reply({ content: 'Reading...', fetchReply: true });
        
        const image = interaction.options.getAttachment('image');
        const input = interaction.options.getString('input');

        console.log(image);
        const worker = await createWorker('eng', 1, {
            logger: m => {
            if (m.status == 'recognizing text') {
            }
            }
        });
        const ret = await worker.recognize(image.url);
        console.log(ret.data.text);
        await worker.terminate();

        await interaction.editReply({ 
                content: `Here is the reciept you uploaded:${input ? `\n${input}` : ''}`, 
                files: [image.url] 
        });
    }
};