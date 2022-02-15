import React, {useState} from 'react';
import {
    Box,
    Button, Checkbox,
    Container,
    Divider,
    Fab, FormControl, FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import {Method, methods, UrlInput, UrlInputComponent} from "./block_builder/UrlInput";
import JSONInput from 'react-json-editor-ajrm';
//@ts-ignore
import locale from 'react-json-editor-ajrm/locale/en';
import ReactJson from 'react-json-view'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/prism';
import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

import {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    FetchingJSONSchemaStore,
} from "quicktype-core";

import {Check, Clipboard} from "react-feather";
import {
    remote_data_source_impl,
    remotes_data_sources,
    repository_impl,
    repository_interface,
    request_url, use_case
} from "./templates";
import { pascalCase } from "pascal-case";
SyntaxHighlighter.registerLanguage('dart', dart);


function App() {
    const [urlInput, setUrlInput] = useState<UrlInput>({
        method: 'GET',
        url: ''
    });

    const [body, setBody] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [baseName, setBaseName] = useState('Request');

    const [auth, setAuth] = useState(false);
    const [repository, setRepository] = useState('');

    const [bodyCode, setBodyCode] = useState('');
    const [responseCode, setResponseCode] = useState('');
    const [method, setMethod] = useState<Method>('POST');

    async function quicktypeJSONSchema(typeName: string, jsonString: string) {
        const jsonInput = jsonInputForTargetLanguage('dart');

        // We could add multiple samples for the same desired
        // type, or many sources for other types. Here we're
        // just making one type from one piece of sample JSON.
        await jsonInput.addSource({
            name: typeName,
            samples: [jsonString],
        });

        const inputData = new InputData();
        inputData.addInput(jsonInput);

        return await quicktype({
            inputData,
            lang: 'dart',
            allPropertiesOptional: true,
            rendererOptions: {
                'copy-with': 'on'
            }
        });
    }


    return (
        <Box sx={{height: '100vh', bgcolor: 'background.default', overflow: 'auto'}}>
            <Box p={4}>
                <Container maxWidth={'lg'}>
                    {/*<UrlInputComponent*/}
                    {/*    onChange={setUrlInput}*/}
                    {/*    value={urlInput}*/}
                    {/*/>*/}
                    <Box>
                        <Grid container spacing={4}>
                            <Grid xs={12} lg={6} item>
                                <Typography color={'textPrimary'} gutterBottom variant={'body1'}>
                                    Request payload
                                </Typography>
                                <JSONInput
                                    id='a_unique_id'
                                    placeholder={{'name': 'Jhon'}}
                                    // colors      = { darktheme }
                                    locale={locale}
                                    colors={{
                                        background: '#1e212a'
                                    }}
                                    onChange={(e: any) => {
                                        setBody(e.json);
                                    }}
                                    width={'100%'}
                                    height='550px'
                                />
                            </Grid>
                            <Grid xs={12} lg={6} item>
                                <Typography gutterBottom color={'textPrimary'} variant={'body1'}>
                                    Request response
                                </Typography>
                                <Box height='550px' bgcolor={'background.paper'} sx={{overflowY: 'auto'}}>
                                    <JSONInput
                                        id='a_unique_id'
                                        placeholder={{'name': 'Jhon'}}
                                        // colors      = { darktheme }
                                        locale={locale}
                                        colors={{
                                            background: '#1e212a'
                                        }}
                                        onChange={(e: any) => {
                                            setResponse(e.json);
                                        }}
                                        width={'100%'}
                                        height='550px'
                                    />
                                </Box>

                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            <Divider/>
            <Box p={4}>
                <Container maxWidth={'lg'}> <Grid container spacing={4}>
                    <Grid item xs={12} lg={6} container spacing={2}>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                value={baseName}
                                fullWidth
                                onChange={e => setBaseName(e.target.value)}
                                label={'Class'}
                                InputProps={{
                                    endAdornment: <InputAdornment position={'end'}>
                                        <Fab
                                            disabled={!body && !response}
                                            onClick={async () => {
                                                if (body) {
                                                    const {lines} = await quicktypeJSONSchema(`${baseName}Payload`, body);
                                                    setBodyCode(lines.join('\n'));
                                                }
                                                if (response) {
                                                    const {lines} = await quicktypeJSONSchema(`${baseName}Response`, response);
                                                    setResponseCode(lines.join('\n'));
                                                }
                                            }}
                                            size={'small'} color={'primary'}>
                                            <Check color={'#fff'}/>
                                        </Fab>
                                    </InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                value={repository}
                                fullWidth
                                onChange={e => setRepository(e.target.value)}
                                label={'Repository'}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Box display={'flex'}>
                            <FormControl sx={{width: 150}}>
                                <InputLabel id="demo-simple-select-label">Method</InputLabel>
                                <Select
                                    value={method}
                                    label={'Method'}
                                    onChange={e => {
                                        setMethod((e.target.value as Method))
                                    }}
                                    sx={{
                                        borderRadius: '10px !important',
                                        '& svg': {
                                            fill: '#fff'
                                        }
                                    }}
                                >
                                    {
                                        methods.map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)
                                    }

                                </Select>
                            </FormControl>
                            <FormControlLabel
                                sx={{color: '#fff'}}
                                label={'Require token'}
                                control={<Checkbox
                                    sx={{ml: 2}}

                                    onChange={e => {
                                        setAuth(e.target.checked);
                                    }}
                                    checked={auth}/>}
                            />
                        </Box>
                    </Grid>
                </Grid>
                    <Box mt={4}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} lg={6}>
                                {bodyCode && <CustomSyntaxHighlighter
                                    title={'Payload class'}
                                    text={bodyCode}/>}
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                {responseCode && <CustomSyntaxHighlighter
                                    title={'Response class'}
                                    text={responseCode}/>}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            <Divider/>
            <Box p={4}>
                <Container maxWidth={'lg'}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={6}>
                            <Box mb={4}>
                                <CustomSyntaxHighlighter
                                    title={'URL'}
                                    text={request_url(pascalCase(baseName))}/>
                            </Box>
                            <Box mb={4}>
                                <CustomSyntaxHighlighter
                                    title={'Remote data source interface'}
                                    text={remotes_data_sources(pascalCase(baseName))}/>
                            </Box>
                            <Box mb={4}>
                                <CustomSyntaxHighlighter
                                    title={'Remote data source implementation'}
                                    text={remote_data_source_impl(pascalCase(baseName), auth, method)}/>
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box mb={4}>
                                <CustomSyntaxHighlighter
                                    title={'Repository interface'}
                                    text={repository_interface(pascalCase(baseName))}/>
                            </Box>
                            <Box mb={4}>
                                <CustomSyntaxHighlighter
                                    title={'Repository implementation'}
                                    text={repository_impl(pascalCase(baseName))}/>
                            </Box>
                            <Box mb={4}>
                                <CustomSyntaxHighlighter
                                    title={'UseCase'}
                                    text={use_case(pascalCase(baseName), repository)}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Divider/>
            <Box p={4}>
                <Container maxWidth={'lg'}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={6}>

                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

const CustomSyntaxHighlighter = ({text, title}: { text: string, title?: string }) => {
    const [copied, setCopied] = useState(false);

    return <Box>
        {title && <Typography color={'textPrimary'} variant={'body1'}>
            {title}
        </Typography>}
        <Box position={'relative'}>
            <SyntaxHighlighter
                showLineNumbers language="dart" style={darcula}>
                {text}
            </SyntaxHighlighter>
            <CopyToClipboard text={text} onCopy={() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            }}>
                <Fab size={'small'} color={'primary'} sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2
                }}>
                    {
                        copied ? <Check color={'#fff'}/> :
                            <Clipboard color={'#fff'}/>
                    }
                </Fab>
            </CopyToClipboard>
        </Box>

    </Box>
}

export default App;
