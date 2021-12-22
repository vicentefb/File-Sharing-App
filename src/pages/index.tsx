import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import { connectDB } from './config/db';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage({ isConnected }) {
  return (
    <div className='bg-gray-800 font-serif grid h-screen place-items-center text-white'>
      <h1>Got a file? Share it here.</h1>
      <div className='bg-gray-600 flex flex-col items-center justify-center rounded-xl shadow-xl w-96'>
        {/*dropzone*/}
        {/*render file*/}
        {/* upload button*/}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // client.db() will be the default database passed in the MONGODB_URI
    // You can change the database by calling the client.db() function and specifying a database like:
    // const db = client.db("myDatabase");
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    connectDB();
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}
