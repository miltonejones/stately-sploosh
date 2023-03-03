import React from 'react';
import { styled, Box, Drawer, Button, TextField, Pagination,
  LinearProgress, Card, Collapse, Typography } from '@mui/material';
  import { Spacer, Columns, Plural, Flex } from "../../../styled";
  import { getMax } from "../../../util/getMax";
import {  ModelCard } from "..";
import { getPagination } from "..";
 
const Layout = styled(Box)(({ theme, thin, short }) => ({
 margin: theme.spacing(0),
 height: short ? 500 : (thin ? 120 : '90vh'),
 transition: 'height 0.3s linear'
}));
 
const Librarian = ({ librarian }) => {

  const { hide, queryPage = 1, state, search_index = 0, response, currentPage } = librarian;
  const progress = 100 * (search_index / response?.keys?.length);
  const found = librarian.responses?.filter(f => !!f.image && !f.ID)
  const items = !hide ? librarian.responses : found;
  const buffering = ['search.lookup', 'get_keys'].some(state.matches);
  const pages = getPagination(items?.filter(res => !!res.image), { page: queryPage, pageSize: 15 });
  const candidates = items?.filter(f => !!f.selected);
  const maxPage = getMax(response?.pages?.map(p => p.page) || []);

  // search.lookup, get_keys
  
 return (
  <Drawer anchor="bottom" open={librarian.open} onClose={() => librarian.send('CLOSE')}>
   <Layout short={librarian.state.matches('import_items')} thin={librarian.state.matches('idle.opened')}>

  {librarian.state.matches('import_items.add_error') && <Flex>
    [   {librarian.error}
    {librarian.stack}]
 <Flex spacing={1}>
        <Button onClick={() => librarian.send('RECOVER')}>
          recover
        </Button>
        <Button onClick={() => librarian.send('RETRY')}>
        RETRY
        </Button>
        <Button onClick={() => librarian.send('SKIP')}>
        SKIP
        </Button>
 </Flex>
    
    </Flex>}


  {!!(progress || buffering) && <LinearProgress variant={buffering ? "indeterminate" : "determinate"} value={progress} />}
 

      <Flex sx={{p: 2}} spacing={1}>
{/* 
      <Box> search_index:
        {JSON.stringify(search_index)}</Box>
      <Box> keys:
        {JSON.stringify(response?.keys?.length)}</Box> */}
      {/* <Box>  page:
        {JSON.stringify(currentPage)}/{maxPage}</Box>  */}
      
       {!!maxPage && !state.matches("idle.opened") && <Pagination
          count={Number(maxPage)}
          page={Number(currentPage)} 
        />}


      {librarian.state.matches('idle.opened') && <Flex sx={{p: 1}} spacing={1}>
          <TextField
            size="small"
            label="Path"
            value={state.context.path}
            autoFocus
            autoComplete="off"
            onChange={e => {
              const { value } = e.target;
              if (!value) return;
              librarian.send({
                type: 'CHANGE',
                key: 'path',
                value: value.split('/').pop()
              })
            }}
          />
          
          <Button onClick={() => librarian.send('FIND')} variant="contained" disabled={!librarian.path}>
            search
          </Button>


          {/* <Button variant="outlined" onClick={() => librarian.send('CLOSE')}>
            close
          </Button>
    */}

        </Flex>}


          <Spacer />
      
      <Box>state: {JSON.stringify(state.value)}   </Box>
        {librarian.state.matches('done') && <>

         {!!found?.length &&  <Button variant="outlined" onClick={() => librarian.send({
            type: 'CHANGE',
            key: 'hide',
            value: !librarian.hide
          })}>
            {hide?"show":"hide"} existing 
          </Button>}
          <Button variant="contained" onClick={() => librarian.send('ADD')} disabled={!candidates?.length}>
           add {candidates?.length} <Plural count={candidates?.length}>item</Plural> 
          </Button>
          <Button variant="contained" color="error" onClick={() => librarian.send('EXIT')}>
            close
          </Button>
        </>}

        {librarian.state.matches('search') &&  (
          <>
         {!!found?.length && <Button variant="outlined" onClick={() => librarian.send({
            type: 'CHANGE',
            key: 'hide',
            value: !librarian.hide
          })}>
            {hide?"show":"hide"} existing 
          </Button>}
          <Button variant="contained" color="error" onClick={() => librarian.send('CANCEL')}>
          stop
          </Button> 
          </>
         )}

        {librarian.state.matches('idle.opened') &&  (
          <Button variant="contained" color="error" onClick={() => librarian.send('CLOSE')}>
          CLOSE
          </Button> 
         )}

      </Flex>


    <Collapse in={librarian.state.matches('import_items')}>
      {/* [{librarian.add_index}] */}
          <Flex sx={{p: 1}}>

                  
            {!!librarian.item && <Card sx={{width: 540, minWidth: 540}}>
              <img
                  style={{
                    width: 540,
                    aspectRatio: "16 / 9",
                    borderRadius: 6,  
                  }}
                  alt={librarian.item.title} src={librarian.item.image.replace(/"/g, "")} 
                  />

                <Box sx={{ m: 1, maxHeight: 80, overflow: 'hidden'}}>
                  <Typography variant="caption">
                  {librarian.item.title}
                  </Typography>        
                </Box>

              </Card>}

              <Collapse
                orientation="horizontal"
                in={!!librarian.stars?.length }
              >
                {!!librarian.stars?.length && (
                  <Columns columns="1fr 1fr 1fr 1fr 1fr 1fr" spacing={2} sx={{ p: 2 }}>
                    {librarian.stars.map((star) => (
                      <ModelCard
                        small={librarian.stars.length > 6}
                        key={star.ID}
                        model={star}
                      />
                    ))}
                  </Columns>
                )}
              </Collapse>


          </Flex>


    </Collapse>
   


    {!librarian.state.matches('import_items') && !!pages.visible && <>

     <Flex spacing={1} sx={{ p: 1}}>
                
        {!!librarian.response?.title && state.matches("search") && <Typography variant="subtitle2">
          {librarian.response.title}
        </Typography>
}
   {pages.pageCount > 1 &&  <Pagination
        count={Number(pages.pageCount)}
        page={Number(queryPage)} 
        onChange={(a, num) => librarian.send({
          type: 'CHANGE',
          key: 'queryPage',
          value: num
        })}
      />}

        {!!found?.length && <> {found?.length} <Plural count={found.length}>item</Plural> found  </>}
     </Flex>
    <Columns sx={{
      alignItems: "flex-start", m: 1
    }} columns="1fr 1fr 1fr 1fr 1fr" spacing={1}>
    {pages.visible?.filter(res => !!res.image)
      .map(res => (
      <Card sx={{ outline: t => res.selected ? `solid 2px ${t.palette.primary.main}` : "" }}
        onClick={() => {
          librarian.send({
            type: 'CHOOSE',
            URL: res.URL
          })
        }}
        >
        <img
          style={{
            width: '100%',
            aspectRatio: "16 / 9",
            borderRadius: 6, 
            opacity: !!res.ID ? 0.5 : 1
          }}
          alt={res.title} src={res.image.replace(/"/g, "")} 
          />

        <Box sx={{ m: 1, maxHeight: 40, overflow: 'hidden'}}>
          <Typography variant="caption" color={!!res.ID ? "text.secondary" : "text.primary"}>
           {res.title}
          </Typography>        
        </Box>

      </Card>
      ))}
    </Columns>


    </>}


     {/* <hr />
     {librarian.path} */}
     {/* <hr/>
<pre>
   [  {JSON.stringify(librarian.response?.pages, 0, 2)}]
   </pre>   
     <hr/> */}

     {/* {JSON.stringify(librarian.responses)} vl_star.php?s=ay6so */}
   </Layout>
   </Drawer>
 );
}
Librarian.defaultProps = {};
export default Librarian;


// https://www.javlibrary.com/en/vl_searchbyid.php?keyword=hmn-033
