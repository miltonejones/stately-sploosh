import React from 'react';
import { styled, Stack, Badge, Box, Button, TextField, Pagination,
  LinearProgress, Card, Collapse, Typography } from '@mui/material';
  import { Spacer, Columns, Plural, BacklessDrawer, Flex } from "../../../styled";
  import { getMax } from "../../../util/getMax";
import {  Photo, ModelCard } from "..";
import { getPagination } from "..";
 
const Layout = styled(Box)(({ theme, thin, short }) => ({
  margin: theme.spacing(0),
  height: short ? '60vh' : (thin ? 120 : '100vh'),
  transition: 'height 0.3s linear'
 }));
 
const Hover = styled(Box)(({ height }) => ({ 
  height ,
  cursor: 'pointer',
  overflow: 'hidden',
  transition: 'height 0.2s linear',
  '&:active': {
    height: 'fit-content'
  }
 }));
   
const ERR_IMAGE = "https://s3.amazonaws.com/sploosh.me.uk/assets/XXX.jpg";
const Librarian = ({ librarian }) => {

  const { hide, queryPage = 1, state, search_index = 0, response, currentPage } = librarian;
  const progress = 100 * (search_index / response?.keys?.length);
  const found = librarian.responses?.filter(f => !!f.image && !f.ID)
  const items = !hide ? librarian.responses : found;
  const buffering = ['search.lookup', 'viewing.load', 'get_keys'].some(state.matches);
  const pages = getPagination(items?.filter(res => !!res.image), { page: queryPage, pageSize: 15 });
  const candidates = items?.filter(f => !!f.selected);
  const maxPage = getMax(response?.pages?.map(p => p.page) || []);
  const pageProg = 100 * (currentPage / maxPage);
  const is = array => typeof array === 'string'
    ? state.matches(array)
    : array.some(state.matches);


  const handleSave = () =>librarian.send('ADD')
  const setState = (key, value) => librarian.send({ type: 'CHANGE', key, value })
  const selectItem = (URL) => librarian.send({ type: 'CHOOSE', URL })
  const itemDetail = (item) => librarian.send({ type: 'SEE', item })
  // search.lookup, get_keys
  
 return (
  <BacklessDrawer anchor="bottom" open={librarian.open} onClose={() => librarian.send('CLOSE')}>
   <Layout short={is(['import_items', 'viewing'])} thin={is(['idle.opened']) || librarian.thin}>

  {is('import_items.add_error') && <Flex>
   <Stack sx={{p: 1}}>
    <Typography color="error">
      {librarian.error}
    </Typography>
    <Typography variant="caption">
      {librarian.stack}
    </Typography> 
 <Flex spacing={1}>
        <Button onClick={() => librarian.send('RECOVER')}>
          cancel
        </Button>
        <Button variant="outlined" onClick={() => librarian.send('RETRY')}>
        RETRY
        </Button>
        <Button variant="contained" color="error" onClick={() => librarian.send('SKIP')}>
        SKIP
        </Button>
 </Flex>
   </Stack>
    
    </Flex>}

      {!is(['done', 'viewing.ready']) && <Stack> 
        {!!pageProg && <LinearProgress variant="determinate" color="secondary" value={pageProg} />}
        {!!progress && <LinearProgress variant="determinate" value={progress} />}
        {!!buffering && <LinearProgress variant="indeterminate" color="error"/>}
        <Typography variant="caption">{JSON.stringify(librarian.status)}   </Typography>
      </Stack>}

      <Flex sx={{p: 1}} spacing={1}>
{/* 
      <Box> search_index:
        {JSON.stringify(search_index)}</Box>
      <Box> keys:
        {JSON.stringify(response?.keys?.length)}</Box> */}
      {/* <pre>  page:
        {JSON.stringify(state,0,2)}/{maxPage}</pre>  */}


        {!is(['import_items', 'viewing']) && !!pages.visible && !!librarian.thin && <Stack>
        <Flex spacing={1} >
                
                {!!librarian.response?.title && is(["search", 'get_keys', 'check_keys']) && <Typography variant="subtitle2">
                  {librarian.response.title}
                </Typography>}
        
                {pages.pageCount > 1 &&  <Pagination
                  count={Number(pages.pageCount)}
                  page={Number(queryPage)} 
                  onChange={(a, num) => setState('queryPage', num)}
                />}
        
                {!!found?.length && <Box onClick={() => setState('hide', !librarian.hide)} > {found?.length} <Plural count={found.length}>item</Plural> found  </Box>}
             </Flex>
        
          
        <Flex spacing={1}>
          {pages.visible.map((res, e) =>( 
          <Box 
            sx={{  outline: t => res.selected ? `solid 2px ${t.palette.primary.main}` : ""  }} 
            onClick={() => itemDetail(res)}>
              <Photo
              backup={ERR_IMAGE}
              style={{
              width: 60,
              aspectRatio: "12 / 9",
              borderRadius: 2, 
              opacity: !!res.ID ? 0.5 : 1
            }} 
              key={e}
             alt={res.title} src={res.image.replace(/"/g, "")} 
            />
          </Box>))}
          </Flex>

          </Stack>}
      


          {!!librarian.response?.title && !librarian.thin && is(["search", 'get_keys', 'check_keys', 'done']) && <Typography variant="subtitle2">
                  {librarian.response.title}
                </Typography>}


       {!!maxPage && !is("idle.opened") && !librarian.thin && <Pagination
          disabled={!is(['check_keys.paused', 'search.paused'])}
          color={is(['check_keys.paused', 'search.paused'])?"primary":"divider"}
          count={Number(maxPage)}
          page={Number(currentPage)} 
          onChange={(_, num) => { 


            const datum = response.pages.find(f => Number(f.page) === num);
            if (datum?.href && datum.href.indexOf('javlibrary') > 0) {
              const path = datum.href.split('/').pop();
              librarian.send({
                type: 'RESET',
                path,
                page: datum.page
              })
            }  
          }}
        />}
{/* [{librarian.path}][{currentPage}] */}

      {is('idle.opened') && <Flex sx={{p: 1}} spacing={2}>
          <TextField
            size="small"
            label="Path"
            value={state.context.path}
            autoFocus
            autoComplete="off"
            onChange={e => {
              const { value } = e.target;
              if (!value) return;
              setState('path', value.split('/').pop()) 
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
      {/* <Box>state: {JSON.stringify(state.value)}   </Box> */}
         {is(['check_keys', 'search']) && <>
         <i className={`fa-solid fa-circle-${is(['check_keys.paused', 'search.paused'])?"play":"pause"}`} 
            onClick={() => librarian.send(is(['check_keys.paused', 'search.paused'])?'RESUME':'PAUSE')}></i>
         </>}
        {is('done') && <> 

          <Flex spacing={2}>
           {!!found?.length &&  <i className={hide?"fa-solid fa-eye-slash":"fa-solid fa-eye"}
             onClick={() =>  setState('hide',  !librarian.hide)  }
              />}


                <i
                  onClick={() => {
                    pages.visible
                      .filter((f) => !f.ID)
                      .map(f => selectItem(f.URL));
                    // handleAppend(ids);
                    // alert (JSON.stringify(ids));
                  }}
                  class="fa-solid fa-check"
                ></i>


            <Badge
              onClick={handleSave}
              sx={{ cursor: "pointer" }}
              badgeContent={candidates?.length}
              color="secondary"
            >
              <i onClick={handleSave} class="fa-solid fa-floppy-disk"></i>
            </Badge>

            <i onClick={() =>  setState('thin',  !librarian.thin)  } className={`fa-solid fa-window-${librarian.thin?"maximize":"restore"}`} />
            <i onClick={() => librarian.send('EXIT')} className="fa-solid fa-xmark" />
            
          </Flex>
 
        </>}

        {is(['search','check_keys','get_keys']) &&  (
          <>
                {!!found?.length &&  <i className={hide?"fa-solid fa-eye-slash":"fa-solid fa-eye"}
             onClick={() =>  setState('hide',  !librarian.hide) }
              />}
 
            <i onClick={() =>  setState('thin',  !librarian.thin)  } className={`fa-solid fa-window-${librarian.thin?"maximize":"restore"}`} />
            <i onClick={() => librarian.send('CANCEL')} className="fa-solid fa-xmark" />
 
          </>
         )}
 
        {is(['idle.opened','viewing']) &&  (
            <i onClick={() => librarian.send('CLOSE')} className="fa-solid fa-xmark" /> 
         )}

      </Flex>


    <Collapse in={is(['import_items', 'viewing.ready', 'viewing.match'])}>
      {/* [{librarian.add_index}] */}
      <Flex sx={{p: 1}}>

              
        {!!librarian.item && <Card 
          onClick={() => selectItem(librarian.item.URL) }
          sx={{width: 540, minWidth: 540, outline: t => librarian.item.selected ? `solid 2px ${t.palette.primary.main}` : "" }}>
          <Photo
            backup={ERR_IMAGE}
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
   


    {!is(['import_items', 'viewing']) && !!pages.visible && !librarian.thin && <>

     <Flex spacing={1} sx={{ p: 1}}>
                
        {/* {!!librarian.response?.title && is(["search", 'get_keys', 'check_keys']) && <Typography variant="subtitle2">
          {librarian.response.title}
        </Typography>} */}

        {pages.pageCount > 1 &&  <Pagination
          count={Number(pages.pageCount)}
          page={Number(queryPage)} 
          onChange={(a, num) => setState('queryPage',  num) }
        />}

        {!!found?.length && <> {found?.length} <Plural count={found.length}>item</Plural> found  </>}



     </Flex>

    <Columns sx={{
      alignItems: "flex-start", m: 1
    }} columns="1fr 1fr 1fr 1fr 1fr" spacing={1}>
    {pages.visible?.filter(res => !!res.image)
      .map(res => (
      <Card sx={{ outline: t => res.selected ? `solid 2px ${t.palette.primary.main}` : "" }}
     
        >
        <Photo   onClick={() => selectItem(res.URL) }
          backup={ERR_IMAGE}
          style={{
            width: '100%',
            aspectRatio: "16 / 9",
            borderRadius: 6, 
            opacity: !!res.ID ? 0.5 : 1
          }}
          alt={res.title} src={res.image.replace(/"/g, "")} 
          />

        <Hover  height={40}  onClick={() => itemDetail(res)} sx={{ m: 1 }}>
          <Typography variant="caption" color={!!res.ID ? "text.secondary" : "text.primary"}>
           {res.title}
          </Typography>        
        </Hover>

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
   </BacklessDrawer>
 );
}
Librarian.defaultProps = {};
export default Librarian;


// https://www.javlibrary.com/en/vl_searchbyid.php?keyword=hmn-033
