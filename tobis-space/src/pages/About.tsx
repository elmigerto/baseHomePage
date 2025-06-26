export default function About() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">About Me</h2>
      <p>
        I enjoy exploring new territory—both mentally and physically. Sports have
        always been a passion: from martial arts and climbing to dance, I've tried a wide range of disciplines.
      </p>
      <p>
        My analytical mindset comes from a master's degree in mechanical engineering (ETH Zurich), my structure from working as a software developer, and my creativity from painting and designing board games.
      </p>
      <p>
        Discord for discussions and more:{' '}
        <a
          href="https://discord.gg/ZF9uQWHt"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          https://discord.gg/ZF9uQWHt
        </a>
      </p>
    </div>
  )
}
