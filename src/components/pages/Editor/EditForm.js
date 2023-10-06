import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Flex, Nowrap, Spacer } from "../../../styled";

const EmbedSection = ({ editor, parser }) => {
  const { domain, searchURL } = parser;
  const fields = ["title", "image", "model"];
  const cols = ["width", "height", "src"];

  return (
    <>
      <TextField
        sx={{ mt: 2 }}
        size="small"
        value={parser.fields.embed.M.regexTag.S}
        name={"regexTag"}
        onChange={editor.handleRegex}
        label="IFrame Regex"
      />
      <Divider textAlign="left">Video data fields</Divider>
      {fields
        .filter((field) => !!parser.fields[field])
        .map((field) => (
          <TextField
            sx={{ mt: 2 }}
            key={field}
            size="small"
            value={parser.fields[field].S}
            name={field}
            onChange={editor.handleEmbed}
            label={field}
          />
        ))}
      <Divider textAlign="left">IFrame embed fields</Divider>
      {cols
        .filter((field) => !!parser.fields.embed.M.regexProp.M[field])
        .map((field) => (
          <TextField
            sx={{ mt: 2 }}
            key={field}
            size="small"
            value={parser.fields.embed.M.regexProp.M[field].S}
            name={field}
            onChange={editor.handleRegex}
            label={field}
          />
        ))}
      <Divider textAlign="left">Specimen</Divider>
      <TextField
        size="small"
        multiline
        rows={6}
        name="specimenEmbedText"
        onChange={editor.handleChange}
        value={editor.specimenEmbedText}
        label="Embed Specimen"
      />
    </>
  );
};

const GeneralSection = ({ editor, parser }) => {
  const { domain, searchURL } = parser;

  return (
    <>
      <TextField
        sx={{ mt: 2 }}
        size="small"
        value={domain}
        name="domain"
        disabled
        onChange={editor.handleUpdate}
        label="Domain"
      />
      <TextField
        sx={{ mt: 2 }}
        size="small"
        value={searchURL}
        name="searchURL"
        onChange={editor.handleUpdate}
        label="Search URL"
      />
    </>
  );
};

const PageSection = ({ editor, parser }) => {
  const { pageRegex, pageParser } = parser;
  return (
    <>
      <Divider textAlign="left">Page Content parser</Divider>
      <TextField
        sx={{ mt: 2 }}
        size="small"
        value={pageParser}
        name="pageParser"
        onChange={editor.handleUpdate}
        label="Page Content Parser"
        multiline
      />

      <TextField
        size="small"
        name="columns"
        onChange={editor.handleChange}
        value={editor.columns}
        placeholder="Columns"
        label="Columns"
      />

      <TextField
        size="small"
        multiline
        rows={6}
        name="specimenText"
        onChange={editor.handleChange}
        value={editor.specimenText}
        label="Content Specimen"
      />

      <Divider textAlign="left">Pagination parser</Divider>
      <TextField
        sx={{ mt: 2 }}
        size="small"
        name="pageRegex"
        value={pageRegex}
        onChange={editor.handleUpdate}
        label="Pagination Parser"
        multiline
      />

      <TextField
        size="small"
        multiline
        rows={6}
        name="specimenPageText"
        onChange={editor.handleChange}
        value={editor.specimenPageText}
        label="Pagination Specimen"
      />
    </>
  );
};

function ParserList({ editor }) {
  return (
    <>
      <Typography sx={{ mb: 2 }} variant="subtitle2">
        Choose a parser
      </Typography>
      {editor.parsers
        .filter((f) => !!f.pageParser)
        .sort((a, b) => (a.domain > b.domain ? 1 : -1))
        .map((p) => (
          <Nowrap
            hover
            key={p.domain}
            style={{ cursor: "pointer" }}
            onClick={() =>
              editor.send({
                type: "open",
                parser: p.domain,
              })
            }
          >
            {p.domain}
          </Nowrap>
        ))}
    </>
  );
}

export const EditForm = (props) => {
  const { parser, editor } = props;
  const handleChange = (event, newValue) => {
    editor.setState("tab", newValue);
  };

  if (!parser) {
    return <ParserList editor={editor} />;
  }

  const { domain } = parser;
  return (
    <>
      <Stack spacing={2}>
        <Flex>
          <Typography variant="h6">{domain}</Typography>
          <Spacer />
          <Box>
            <IconButton onClick={() => editor.send("close")}>
              &times;
            </IconButton>
          </Box>
        </Flex>
        {/* <Divider /> */}
        <Tabs
          value={editor.tab}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="General" />
          <Tab label="Page" />
          <Tab label="Embed" />
          <Tab label="JSON" />
        </Tabs>

        {editor.tab === 1 && <PageSection {...props} />}
        {editor.tab === 0 && <GeneralSection {...props} />}
        {editor.tab === 2 && <EmbedSection {...props} />}
        {editor.tab === 3 && <pre>{JSON.stringify(parser, 0, 2)}</pre>}

        <Flex spacing={1}>
          <Spacer />
          <Button onClick={() => editor.send("close")}>cancel</Button>
          <Button
            disabled={!editor.state.can("save")}
            variant="contained"
            onClick={() => editor.send("save")}
          >
            save
          </Button>
        </Flex>
        {/* <pre>{JSON.stringify(editor.specimen, 0, 2)}</pre> */}
        {/* <pre>{JSON.stringify(parser, 0, 2)}</pre> */}
      </Stack>
    </>
  );
};

/**="9033870|0" id="vf9033870"><div class="mvhdico" title="Quality"><span>480p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-xIphcqf59cP/serious-pure-love-from-a-teacher-yumeno/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/9/90/903/9033870/13_240.jpg" data-st="9033870|13|0" alt="Serious Pure Love From A Teacher Yumeno" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-xIphcqf59cP/serious-pure-love-from-a-teacher-yumeno/">Serious Pure Love From A Teacher Yumeno</a></p><p class="mbstats"><span class="mbtim" title="Duration">120:51</span><span class="mbrate" title="Rating">84%</span><span class="mbvie" title="Views">416,797</span><span class="mb-uploader"><a href="/profile/anorwfi/" title="Uploader">anorwfi</a></span></p></div></div>
<div class="mb hdy" data-id="9034080" data-vp="9034080|0" id="vf9034080"><div class="mvhdico" title="Quality"><span>1080p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-EhqdnPaoLJJ/molly-little-pov/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/9/90/903/9034080/5_240.jpg" data-st="9034080|5|0" alt="Molly Little - POV" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-EhqdnPaoLJJ/molly-little-pov/">Molly Little - POV</a></p><p class="mbstats"><span class="mbtim" title="Duration">33:32</span><span class="mbrate" title="Rating">89%</span><span class="mbvie" title="Views">163,815</span><span class="mb-uploader"><a href="/profile/P4PI/" title="Uploader">P4PI</a></span></p></div></div>
<div class="mb" data-id="9029786" data-vp="9029786|0" id="vf9029786"><div class="mvhdico" title="Quality"><span>480p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-TVepZAnqKm2/yuko-shiraki-boss-wife-eng-sub/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/9/90/902/9029786/7_240.jpg" data-st="9029786|7|0" alt="Yuko Shiraki Boss Wife Eng Sub" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-TVepZAnqKm2/yuko-shiraki-boss-wife-eng-sub/">Yuko Shiraki Boss Wife Eng Sub</a></p><p class="mbstats"><span class="mbtim" title="Duration">103:11</span><span class="mbrate" title="Rating">85%</span><span class="mbvie" title="Views">311,180</span><span class="mb-uploader"><a href="/profile/Kyonekyone/" title="Uploader">Kyonekyone</a></span></p></div></div>
<div class="mb" data-id="9026506" data-vp="9026506|0" id="vf9026506"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-XHsK4m4KmRp/english-subs-while-her-husband-was-away-she-got-fucked-by-his-coworkers-saeko-matsushita/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/9/90/902/9026506/13_240.jpg" data-st="9026506|13|0" alt="(English Subs) While Her Husband Was Away, She Got Fucked By His Coworkers - Saeko Matsushita" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-XHsK4m4KmRp/english-subs-while-her-husband-was-away-she-got-fucked-by-his-coworkers-saeko-matsushita/">(English Subs) While Her Husband Was Away, She Got Fucked By His Coworkers - Saeko Matsushita</a></p><p class="mbstats"><span class="mbtim" title="Duration">97:19</span><span class="mbrate" title="Rating">88%</span><span class="mbvie" title="Views">345,518</span><span class="mb-uploader"><a href="/profile/SAEKO9999/" title="Uploader">SAEKO9999</a></span></p></div></div>
<div class="mb" data-id="9014821" data-vp="9014821|0" id="vf9014821"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-f6FxhiVQjG0/doodh-wali-part-1/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/9/90/901/9014821/9_240.jpg" data-st="9014821|9|0" alt="Doodh Wali Part 1" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-f6FxhiVQjG0/doodh-wali-part-1/">Doodh Wali Part 1</a></p><p class="mbstats"><span class="mbtim" title="Duration">66:06</span><span class="mbrate" title="Rating">82%</span><span class="mbvie" title="Views">221,600</span><span class="mb-uploader"><a href="/profile/xoxo000069/" title="Uploader">xoxo000069</a></span></p></div></div>
<div class="mb hdy" data-id="9003793" data-vp="9003793|0" id="vf9003793"><div class="mvhdico" title="Quality"><span>1080p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-3wmx9qvTJNi/argendana-fucking-world-champion-whore-bitch-fukig-bitch-woman/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/9/90/900/9003793/9_240.jpg" data-st="9003793|9|0" alt="ARGENDANA Fucking World Champion Whore Bitch Fukig Bitch Woman" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-3wmx9qvTJNi/argendana-fucking-world-champion-whore-bitch-fukig-bitch-woman/">ARGENDANA Fucking World Champion Whore Bitch Fukig Bitch Woman</a></p><p class="mbstats"><span class="mbtim" title="Duration">63:59</span><span class="mbrate" title="Rating">83%</span><span class="mbvie" title="Views">340,766</span><span class="mb-uploader"><a href="/profile/SUCKCUM/" title="Uploader">SUCKCUM</a></span></p></div></div>
<div class="mb" data-id="8994052" data-vp="8994052|0" id="vf8994052"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-igEgjmhx3zf/fucking-thick-mexican-milf-claudia-y/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/899/8994052/1_240.jpg" data-st="8994052|1|0" alt="Fucking Thick Mexican MILF Claudia Y" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-igEgjmhx3zf/fucking-thick-mexican-milf-claudia-y/">Fucking Thick Mexican MILF Claudia Y</a></p><p class="mbstats"><span class="mbtim" title="Duration">25:35</span><span class="mbrate" title="Rating">86%</span><span class="mbvie" title="Views">385,943</span><span class="mb-uploader"><a href="/profile/Charon/" title="Uploader">Charon</a></span></p></div></div>
<div class="mb" data-id="8996711" data-vp="8996711|0" id="vf8996711"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-WuI9P8O8Zz8/marta/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/899/8996711/1_240.jpg" data-st="8996711|1|0" alt="Marta" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-WuI9P8O8Zz8/marta/">Marta</a></p><p class="mbstats"><span class="mbtim" title="Duration">31:43</span><span class="mbrate" title="Rating">85%</span><span class="mbvie" title="Views">500,188</span><span class="mb-uploader"><a href="/profile/Vk01/" title="Uploader">Vk01</a></span></p></div></div>
<div class="mb" data-id="8995722" data-vp="8995722|0" id="vf8995722"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-Fx9OkvEaZ21/the-cock-that-finally-broke-her/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/899/8995722/14_240.jpg" data-st="8995722|14|0" alt="The Cock That Finally Broke Her" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-Fx9OkvEaZ21/the-cock-that-finally-broke-her/">The Cock That Finally Broke Her</a></p><p class="mbstats"><span class="mbtim" title="Duration">40:52</span><span class="mbrate" title="Rating">80%</span><span class="mbvie" title="Views">273,101</span><span class="mb-uploader"><a href="/profile/Orspasm/" title="Uploader">Orspasm</a></span></p></div></div>
<div class="mb" data-id="8983305" data-vp="8983305|0" id="vf8983305"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-4Hw199IUGwP/two-indian-milf-having-chocolate-sex/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/898/8983305/1_240.jpg" data-st="8983305|1|0" alt="Two Indian MILF Having Chocolate Sex" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-4Hw199IUGwP/two-indian-milf-having-chocolate-sex/">Two Indian MILF Having Chocolate Sex</a></p><p class="mbstats"><span class="mbtim" title="Duration">37:47</span><span class="mbrate" title="Rating">83%</span><span class="mbvie" title="Views">415,759</span><span class="mb-uploader"><a href="/profile/xoxo000069/" title="Uploader">xoxo000069</a></span></p></div></div>
<div class="mb" data-id="8989511" data-vp="8989511|0" id="vf8989511"><div class="mvhdico" title="Quality"><span>480p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-myxvwTAEyqI/i-was-kocked-out-with-my-girlfriend-but-my-best-friend-who-was-lying-next-fucked-her-and-made-her-cum-knowing-it-yayoi/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/898/8989511/10_240.jpg" data-st="8989511|10|0" alt="I Was Kocked Out With My Girlfriend But My Best Friend Who Was Lying Next Fucked Her And Made Her Cum Knowing It Yayoi" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-myxvwTAEyqI/i-was-kocked-out-with-my-girlfriend-but-my-best-friend-who-was-lying-next-fucked-her-and-made-her-cum-knowing-it-yayoi/">I Was Kocked Out With My Girlfriend But My Best Friend Who Was Lying Next Fucked Her And Made Her Cum Knowing It Yayoi</a></p><p class="mbstats"><span class="mbtim" title="Duration">124:08</span><span class="mbrate" title="Rating">84%</span><span class="mbvie" title="Views">441,630</span><span class="mb-uploader"><a href="/profile/anorwfi/" title="Uploader">anorwfi</a></span></p></div></div>
<div class="mb hdy" data-id="8985172" data-vp="8985172|0" id="vf8985172"><div class="mvhdico" title="Quality"><span>2K (1440p)</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-23GWzN5fhIF/claudia-garcia-4k/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/898/8985172/14_240.jpg" data-st="8985172|14|0" alt="Claudia Garcia [4K]" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-23GWzN5fhIF/claudia-garcia-4k/">Claudia Garcia [4K]</a></p><p class="mbstats"><span class="mbtim" title="Duration">52:05</span><span class="mbrate" title="Rating">87%</span><span class="mbvie" title="Views">257,009</span><span class="mb-uploader"><a href="/profile/BIGASSMILFHQ/" title="Uploader">BIGASSMILFHQ</a></span></p></div></div>
<div class="mb hdy" data-id="8967992" data-vp="8967992|0" id="vf8967992"><div class="mvhdico" title="Quality"><span>2K (1440p)</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-DrcypkdP6PY/loli-vs-bbc-2-12-guys-fuck-her/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/896/8967992/6_240.jpg" data-st="8967992|6|0" alt="Loli Vs BBC 2 (12 Guys Fuck Her)" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-DrcypkdP6PY/loli-vs-bbc-2-12-guys-fuck-her/">Loli Vs BBC 2 (12 Guys Fuck Her)</a></p><p class="mbstats"><span class="mbtim" title="Duration">56:18</span><span class="mbrate" title="Rating">85%</span><span class="mbvie" title="Views">338,792</span><span class="mb-uploader"><a href="/profile/JapaneseTeenSluts/" title="Uploader">JapaneseTeenSluts</a></span></p></div></div>
<div class="mb" data-id="8940857" data-vp="8940857|0" id="vf8940857"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-I9EULDIZdWS/legal-4685/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/894/8940857/8_240.jpg" data-st="8940857|8|0" alt="Legal (4685)" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-I9EULDIZdWS/legal-4685/">Legal (4685)</a></p><p class="mbstats"><span class="mbtim" title="Duration">39:32</span><span class="mbrate" title="Rating">82%</span><span class="mbvie" title="Views">413,122</span><span class="mb-uploader"><a href="/profile/alexmorais/" title="Uploader">alexmorais</a></span></p></div></div>
<div class="mb hdy" data-id="8936760" data-vp="8936760|0" id="vf8936760"><div class="mvhdico" title="Quality"><span>4K (2160p)</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-BRonFwGzphj/this-ain-t-barbie-xxx-2023/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/893/8936760/1_240.jpg" data-st="8936760|1|0" alt="This Ain&#039;t Barbie XXX (2023)" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-BRonFwGzphj/this-ain-t-barbie-xxx-2023/">This Ain&#039;t Barbie XXX (2023)</a></p><p class="mbstats"><span class="mbtim" title="Duration">83:08</span><span class="mbrate" title="Rating">82%</span><span class="mbvie" title="Views">402,596</span><span class="mb-uploader"><a href="/profile/arzezio7/" title="Uploader">arzezio7</a></span></p></div></div>
<div class="mb hdy" data-id="8924013" data-vp="8924013|0" id="vf8924013"><div class="mvhdico" title="Quality"><span>1080p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-BAxCrHg5MCA/sara-jay-x-elana-bunnz/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/892/8924013/1_240.jpg" data-st="8924013|1|0" alt="Sara Jay X Elana Bunnz" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-BAxCrHg5MCA/sara-jay-x-elana-bunnz/">Sara Jay X Elana Bunnz</a></p><p class="mbstats"><span class="mbtim" title="Duration">29:30</span><span class="mbrate" title="Rating">86%</span><span class="mbvie" title="Views">795,539</span><span class="mb-uploader"><a href="/profile/PushItToTheLimit/" title="Uploader">PushItToTheLimit</a></span></p></div></div>
<div class="mb hdy" data-id="8916583" data-vp="8916583|0" id="vf8916583"><div class="mvhdico" title="Quality"><span>2K (1440p)</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-X7s98k6w9qS/sara-jay-sara-s-seductive-therapy/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/891/8916583/5_240.jpg" data-st="8916583|5|0" alt="Sara Jay - Sara&#039;s Seductive Therapy" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-X7s98k6w9qS/sara-jay-sara-s-seductive-therapy/">Sara Jay - Sara&#039;s Seductive Therapy</a></p><p class="mbstats"><span class="mbtim" title="Duration">26:22</span><span class="mbrate" title="Rating">89%</span><span class="mbvie" title="Views">519,710</span><span class="mb-uploader"><a href="/profile/Qknight/" title="Uploader">Qknight</a></span></p></div></div>
<div class="mb hdy" data-id="8918089" data-vp="8918089|0" id="vf8918089"><div class="mvhdico" title="Quality"><span>1080p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-1q2y05lgzwk/disco-bhabhi-neonx/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/891/8918089/15_240.jpg" data-st="8918089|15|0" alt="Disco Bhabhi - Neonx" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-1q2y05lgzwk/disco-bhabhi-neonx/">Disco Bhabhi - Neonx</a></p><p class="mbstats"><span class="mbtim" title="Duration">47:33</span><span class="mbrate" title="Rating">81%</span><span class="mbvie" title="Views">315,661</span><span class="mb-uploader"><a href="/profile/Itsmertj/" title="Uploader">Itsmertj</a></span></p></div></div>
<div class="mb hdy" data-id="8906803" data-vp="8906803|0" id="vf8906803"><div class="mvhdico" title="Quality"><span>1080p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-jklFmgYBWDs/lena-the-plug-bbc-sextape-with-jason-luv/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/890/8906803/8_240.jpg" data-st="8906803|8|0" alt="Lena The Plug BBC Sextape With Jason Luv" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-jklFmgYBWDs/lena-the-plug-bbc-sextape-with-jason-luv/">Lena The Plug BBC Sextape With Jason Luv</a></p><p class="mbstats"><span class="mbtim" title="Duration">29:51</span><span class="mbrate" title="Rating">73%</span><span class="mbvie" title="Views">181,966</span><span class="mb-uploader"><a href="/profile/Chapizaantrax/" title="Uploader">Chapizaantrax</a></span></p></div></div>
<div class="mb" data-id="8902173" data-vp="8902173|0" id="vf8902173"><div class="mvhdico" title="Quality"><span>720p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-K5TPonEZ3ZB/a-work-of-art-from-head-to-toe/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/89/890/8902173/10_240.jpg" data-st="8902173|10|0" alt="A Work Of Art From Head To Toe" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-K5TPonEZ3ZB/a-work-of-art-from-head-to-toe/">A Work Of Art From Head To Toe</a></p><p class="mbstats"><span class="mbtim" title="Duration">29:05</span><span class="mbrate" title="Rating">83%</span><span class="mbvie" title="Views">534,941</span><span class="mb-uploader"><a href="/profile/Zero26/" title="Uploader">Zero26</a></span></p></div></div>
<div class="mb hdy" data-id="8887510" data-vp="8887510|0" id="vf8887510"><div class="mvhdico" title="Quality"><span>1080p</span></div><div class="mbimg"><div class="mbcontent"><a href="/video-AWZcf27oaEh/manuel-ferrara-makes-use-of-his-he-man-dick-on-super-sexy-witch-lena-paul-while-they-have-a-private-fuck-session-in-a-hotel-room/"><img class="lazyimg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="https://static-ca-cdn.eporner.com/thumbs/static4/8/88/888/8887510/6_240.jpg" data-st="8887510|6|0" alt="Manuel Ferrara Makes Use Of His He-Man Dick On Super Sexy Witch Lena Paul, While They Have A Private Fuck Session In A Hotel Room" /></a></div></div><div class="mbunder"><p class="mbtit"><a href="/video-AWZcf27oaEh/manuel-ferrara-makes-use-of-his-he-man-dick-on-super-sexy-witch-lena-paul-while-they-have-a-private-fuck-session-in-a-hotel-room/">Manuel Ferrara Makes Use Of His He-Man Dick On Super Sexy Witch Lena Paul, While They Have A Private Fuck Session In A Hotel Room</a></p><p class="mbstats"><span class="mbtim" title="Duration">65:30</span><span class="mbrate" title="Rating">86%</span><span class="mbvie" title="Views">563,157</span><span class="mb-uploader"><a href="/profile/OmegaRed25/" title="Uploader">OmegaRed25</a></span></p></div></div>
<div class="mb hdy" data-id="8871609" data-vp="8871609|0" id="v 


\/search\/[^\/]+\/(\d+)\/


v class="numlist2">
<span class='nmhere'>1</span><a href='/search/ass-GaqNpyab/2/' title='Page 2'><span>2</span></a><a href='/search/ass-GaqNpyab/3/' title='Page 3'><span>3</span></a><a href='/search/ass-GaqNpyab/4/' title='Page 4'><span>4</span></a><a href='/search/ass-GaqNpyab/5/' title='Page 5'><span>5</span></a><a href='/search/ass-GaqNpyab/6/' class='extrapages2' title='Page 6'><span>6</span></a><a href='/search/ass-GaqNpyab/7/' class='extrapages1' title='Page 7'><span>7</span></a><a href='/search/ass-GaqNpyab/8/' class='extrapages1' title='Page 8'><span>8</span></a><a href='/search/ass-GaqNpyab/9/' class='extrapages1' title='Page 9'><span>9</span></a><a href='/search/ass-GaqNpyab/2/' class='nmnext' title='Next page'><span>NEXT </span></a> </div>
<div class="clear"></di


*/

/**
 <div class="video"[\s\S]*?<a href="([^"]+)" title="([^"]+)"[\s\S]*?<img src="([^"]+)"

 </div>
</div>
</div>
</div>
</li> 
<li id="video-160451"> 
<div class="video">
<a href="/160451/english-sub-hima-89-true-mother-to-child-fucking-forbidden-seeding-intercourse-of-mother-and-son-mei/" title="English Sub HIMA-89 True Mother-to-Child Fucking Forbidden Seeding Intercourse Of Mother And Son Meiko Fukada" class="thumbnail">
<div class="video-thumb">
<img src="https://img.javdoe.sh/tmb/000/160/451/1.jpg" alt="English Sub HIMA-89 True Mother-to-Child Fucking Forbidden Seeding Intercourse Of Mother And Son Meiko Fukada" id="preview-160451-1-1-watched" />
</div>
<span class="video-title">English Sub HIMA-89 True Mother-to-Child Fucking Forbidden Seeding Intercourse Of Mother And Son Meiko Fukada</span>
<span class="video-overlay badge transparent">
2019-11-21 57 minutes ago</span>
</span>
</a>
<button type="button" class="button" data-toggle="modal" data-target="#myModal-160451"></button>
<div class="modal fade" id="myModal-160451" role="dialog">
<div class="modal-dialog">

<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal">&times;</button>
<h4 class="modal-title">Trailer Movie</h4>
</div>
<div class="modal-body">
<video id="player1" class="video-js vjs-default-skin" controls preload="none" width="100%" height="100%" poster="https://cdn11.javtop.fun/upload_jav/782650/HIMA-89.jpg">
<source src="//cc3001.dmm.co.jp/litevideo/freepv/h/h_0/h_086hima00089/h_086hima00089_dm_w.mp4" type="video/mp4" label="trailer" res="720p" /></video>
<div class="row">
<a href="/160451/english-sub-hima-89-true-mother-to-child-fucking-forbidden-seeding-intercourse-of-mother-and-son-mei/" title="English Sub HIMA-89 True Mother-to-Child Fucking Forbidden Seeding Intercourse Of Mother And Son Meiko Fukada">
<div class="col-sm-12">English Sub HIMA-89 True Mother-to-Child Fucking Forbidden Seeding Intercourse Of Mother And Son Meiko Fukada</div>
<div class="col-sm-12">2019-11-21</div>
<div class="col-sm-12 btn btn-default btn-sm">More details about this Video >></div>
</a>
</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
</div>
</div> https[^/]+page=(\d+)
</div>

width="([^"]+)"\s+
height="([^"]+)"\s+
https[^"]+page=(\d+)

<iframe (src="[^"]+"[^>]+)>


 */
